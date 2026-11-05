from fastapi import ( # type: ignore
    FastAPI,
    UploadFile,
    File,
    Form
)

from fastapi.middleware.cors import ( # type: ignore
    CORSMiddleware
)

import httpx # type: ignore
import os
import re

from datetime import datetime, date


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(
    title="OSCA Age Verification API",
    version="2.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://application-system-kappa.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =====================================================
# CONFIGURATION
# =====================================================

MINIMUM_SENIOR_AGE = 60

OCR_SPACE_URL = (
    "https://api.ocr.space/parse/image"
)

OCR_SPACE_API_KEY = os.getenv(
    "OCR_SPACE_API_KEY"
)


# =====================================================
# BASIC ROUTES
# =====================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message":
            "OSCA Age Verification API is running."
    }


@app.get("/health")
def health():

    return {
        "success": True,
        "status": "healthy",
        "ocrConfigured":
            bool(
                OCR_SPACE_API_KEY
            )
    }


# =====================================================
# DATE HELPERS
# =====================================================

def parse_birth_date(
    value
):

    if not value:
        return None


    value = value.strip()


    value = re.sub(
        r",\s*",
        ", ",
        value
    )


    formats = [
        "%B %d, %Y",
        "%b %d, %Y",
        "%B %d %Y",
        "%b %d %Y",
        "%m/%d/%Y",
        "%d/%m/%Y",
        "%Y-%m-%d"
    ]


    for date_format in formats:

        try:

            return (
                datetime.strptime(
                    value,
                    date_format
                )
                .date()
            )

        except ValueError:

            continue


    return None


def calculate_age(
    birth_date
):

    today = date.today()


    age = (
        today.year
        -
        birth_date.year
    )


    if (
        (
            today.month,
            today.day
        )
        <
        (
            birth_date.month,
            birth_date.day
        )
    ):

        age -= 1


    return age


# =====================================================
# DOB EXTRACTION
# =====================================================

def extract_birth_date_from_text(text, expected_birth_date=None):
    """
    Extract the date of birth from OCR text while supporting both numeric
    dates and dates with written month names (for example, SEPTEMBER 18, 1964
    or 18 SEPTEMBER 1964). Prefer a candidate next to a DOB label. If OCR
    loses the label, only use an unambiguous written-month date or a unique
    numeric match to the date entered by the applicant.
    """
    if not text:
        return None

    normalized = re.sub(r"\\s+", " ", str(text)).strip()
    month_pattern = (
        r"January|February|March|April|May|June|July|August|September|"
        r"October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|"
        r"Oct|Nov|Dec"
    )

    def parse_candidate(value):
        value = re.sub(r"\\s+", " ", value.strip())
        value = re.sub(r"(?<=\\d)[Oo](?=\\d)", "0", value)
        value = re.sub(r"(?<=\\d)[Il](?=\\d)", "1", value)

        # Normalize OCR variations in month-name dates, including either
        # day/month order, optional commas/periods, and ordinal suffixes.
        month_first = re.fullmatch(
            rf"(?i)({month_pattern})\\.?[\\s,./-]+(\\d{{1,2}})(?:st|nd|rd|th)?[\\s,./-]+(\\d{{4}})",
            value
        )
        day_first = re.fullmatch(
            rf"(?i)(\\d{{1,2}})(?:st|nd|rd|th)?[\\s,./-]+({month_pattern})\\.?[\\s,./-]+(\\d{{4}})",
            value
        )

        if month_first or day_first:
            match = month_first or day_first
            if month_first:
                month_text, day_text, year_text = match.groups()
            else:
                day_text, month_text, year_text = match.groups()

            month_number = datetime.strptime(
                month_text[:3].title(), "%b"
            ).month
            try:
                return date(
                    int(year_text),
                    month_number,
                    int(day_text)
                )
            except ValueError:
                return None

        for date_format in (
            "%m/%d/%Y", "%d/%m/%Y",
            "%m-%d-%Y", "%d-%m-%Y",
            "%Y-%m-%d"
        ):
            try:
                return datetime.strptime(value, date_format).date()
            except ValueError:
                continue
        return None

    # Capture month-name dates in either order, plus numeric dates.
    date_pattern = re.compile(
        rf"(?i)\\b(?:{month_pattern})\\.?[\\s,./-]+\\d{{1,2}}"
        rf"(?:st|nd|rd|th)?[\\s,./-]+\\d{{4}}\\b"
        rf"|\\b\\d{{1,2}}(?:st|nd|rd|th)?[\\s,./-]+"
        rf"(?:{month_pattern})\\.?[\\s,./-]+\\d{{4}}\\b"
        rf"|\\b\\d{{1,2}}[/-]\\d{{1,2}}[/-]\\d{{4}}\\b"
        rf"|\\b\\d{{4}}-\\d{{2}}-\\d{{2}}\\b"
    )

    candidates = []
    for match in date_pattern.finditer(normalized):
        parsed = parse_candidate(match.group(0))
        if parsed:
            candidates.append((match.start(), match.end(), parsed))

    if not candidates:
        return None

    # A DOB label is the strongest signal; choose the closest date after it.
    labels = list(re.finditer(
        r"(?i)\\b(?:date\\s+of\\s+birth|birth\\s+date|birthdate|dob)\\b",
        normalized
    ))
    for label in labels:
        nearby = [
            (abs(pos - label.end()), parsed)
            for pos, end, parsed in candidates
            if pos >= label.end() - 8 and pos <= label.end() + 100
        ]
        if nearby:
            nearby.sort(key=lambda item: item[0])
            return nearby[0][1]

    # Written month names are not ambiguous between day/month and month/day.
    month_name_dates = [
        parsed for pos, end, parsed in candidates
        if re.search(rf"(?i)\\b(?:{month_pattern})\\b", normalized[pos:end])
    ]
    if len(month_name_dates) == 1:
        return month_name_dates[0]

    # For numeric-only dates, never guess between unrelated ID dates.
    if expected_birth_date:
        matching_dates = {
            parsed for _, _, parsed in candidates
            if parsed == expected_birth_date
        }
        if len(matching_dates) == 1:
            return next(iter(matching_dates))

    return None


# =====================================================
# OCR.SPACE
# =====================================================

async def run_ocr(
    file_bytes,
    filename,
    content_type
):

    if not OCR_SPACE_API_KEY:

        raise RuntimeError(
            "OCR_SPACE_API_KEY is not configured."
        )


    files = {
        "file": (
            filename
            or
            "valid-id.jpg",

            file_bytes,

            content_type
            or
            "image/jpeg"
        )
    }


    data = {
        "language":
            "eng",

        "OCREngine":
            "2",

        "isOverlayRequired":
            "false",

        "scale":
            "true"
    }


    headers = {
        "apikey":
            OCR_SPACE_API_KEY
    }


    async with httpx.AsyncClient(
        timeout=60.0
    ) as client:

        response = (
            await client.post(
                OCR_SPACE_URL,
                data=data,
                files=files,
                headers=headers
            )
        )


    response.raise_for_status()


    result = response.json()


    if result.get(
        "IsErroredOnProcessing"
    ):

        error_message = (
            result.get(
                "ErrorMessage"
            )
        )


        if isinstance(
            error_message,
            list
        ):

            error_message = " ".join(
                str(item)
                for item
                in error_message
            )


        raise RuntimeError(
            error_message
            or
            "OCR processing failed."
        )


    parsed_results = (
        result.get(
            "ParsedResults"
        )
        or
        []
    )


    if not parsed_results:
        return ""


    full_text = "\n".join(
        item.get(
            "ParsedText",
            ""
        )
        for item
        in parsed_results
    )


    return full_text


# =====================================================
# AGE VERIFICATION ENDPOINT
# =====================================================

@app.post("/verify-age")
async def verify_age(

    document:
        UploadFile = File(...),

    date_of_birth:
        str = Form(...)
):

    # =================================================
    # 1. VALIDATE FORM DOB
    # =================================================

    try:

        entered_birth_date = (
            datetime.strptime(
                date_of_birth,
                "%Y-%m-%d"
            )
            .date()
        )

    except ValueError:

        return {
            "success":
                False,

            "verified":
                False,

            "message":
                "The entered date of birth is invalid."
        }


    # =================================================
    # 2. READ ID
    # =================================================

    document_bytes = (
        await document.read()
    )


    if not document_bytes:

        return {
            "success":
                False,

            "verified":
                False,

            "message":
                "The uploaded valid ID is empty."
        }


    # =================================================
    # 3. OCR
    # =================================================

    try:

        ocr_text = await run_ocr(
            document_bytes,
            document.filename,
            document.content_type
        )

    except Exception as exc:

        print(
            "OCR API error:",
            repr(
                exc
            )
        )


        return {
            "success":
                False,

            "verified":
                False,

            "message":
                "Unable to read the date of birth from the uploaded valid ID."
        }


    # =================================================
    # 4. EXTRACT DOB
    # =================================================

    detected_birth_date = (
        extract_birth_date_from_text(
            ocr_text,
            expected_birth_date=entered_birth_date
        )
    )


    if detected_birth_date is None:

        return {
            "success":
                True,

            "verified":
                False,

            "enteredBirthDate":
                entered_birth_date.isoformat(),

            "detectedBirthDate":
                None,

            "birthDateMatches":
                False,

            "age":
                None,

            "ageEligible":
                False,

            "message":
                "No recognizable date of birth was found on the uploaded valid ID."
        }


    # =================================================
    # 5. COMPARE DOB
    # =================================================

    birth_date_matches = (
        entered_birth_date
        ==
        detected_birth_date
    )


    # =================================================
    # 6. CALCULATE AGE
    # =================================================

    age = calculate_age(
        detected_birth_date
    )


    age_eligible = (
        age
        >=
        MINIMUM_SENIOR_AGE
    )


    # =================================================
    # 7. FINAL RESULT
    # =================================================

    verified = (
        birth_date_matches
        and
        age_eligible
    )


    if not birth_date_matches:

        message = (
            "The date of birth entered in the application "
            "does not match the uploaded valid ID."
        )

    elif not age_eligible:

        message = (
            "The applicant is not yet 60 years old."
        )

    else:

        message = (
            "Age verification passed."
        )


    return {
        "success":
            True,

        "verified":
            verified,

        "enteredBirthDate":
            entered_birth_date.isoformat(),

        "detectedBirthDate":
            detected_birth_date.isoformat(),

        "birthDateMatches":
            birth_date_matches,

        "age":
            age,

        "minimumAge":
            MINIMUM_SENIOR_AGE,

        "ageEligible":
            age_eligible,

        "message":
            message
    }