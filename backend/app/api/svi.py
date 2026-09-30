from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from transformers import pipeline

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.complaint import Complaint
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/svi",
    tags=["SVI"],
)


# Load the NLP sentiment model once when the module starts.
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
)


def detect_indicators(text: str):
    """
    Prototype multilingual SVI indicators.
    Supported demo languages:
    English, Tamil, Hindi.

    These are screening indicators, not medical diagnoses.
    """

    text_lower = text.lower()

    patterns = {
        "distress": [
            # English
            "stress",
            "distressed",
            "depressed",
            "worried",
            "anxious",
            "crying",
            "cannot sleep",
            "can't sleep",
            "sleep",

            # Tamil
            "மன அழுத்தம்",
            "மனஅழுத்தம்",
            "கவலை",
            "கவலையாக",
            "பதற்றம்",
            "அழுகிறேன்",
            "தூங்க முடியவில்லை",

            # Hindi
            "तनाव",
            "परेशान",
            "चिंता",
            "चिंतित",
            "घबराहट",
            "रो रही",
            "सो नहीं पा रही",
            "नींद नहीं",
        ],

        "fear": [
            # English
            "afraid",
            "fear",
            "scared",
            "threat",
            "threatened",
            "terrified",

            # Tamil
            "பயம்",
            "பயமாக",
            "அச்சம்",
            "அச்சமாக",
            "மிரட்டல்",
            "மிரட்டப்பட்ட",
            "திகில்",

            # Hindi
            "डर",
            "डर लग",
            "भय",
            "भयभीत",
            "धमकी",
            "धमकाया",
            "घबराहट",
        ],

        "safety": [
            # English
            "unsafe",
            "danger",
            "dangerous",
            "violence",
            "violent",
            "attack",
            "hurt",
            "harm",

            # Tamil
            "பாதுகாப்பாக இல்லை",
            "ஆபத்து",
            "ஆபத்தான",
            "வன்முறை",
            "தாக்குதல்",
            "காயம்",
            "தீங்கு",

            # Hindi
            "सुरक्षित नहीं",
            "खतरा",
            "खतरनाक",
            "हिंसा",
            "हमला",
            "चोट",
            "नुकसान",
        ],

        "helplessness": [
            # English
            "helpless",
            "powerless",
            "cannot do anything",
            "can't do anything",
            "no way",
            "nothing I can do",

            # Tamil
            "உதவியற்ற",
            "எதுவும் செய்ய முடியவில்லை",
            "வழியில்லை",
            "என்னால் எதுவும் செய்ய முடியவில்லை",

            # Hindi
            "बेबस",
            "लाचार",
            "कुछ नहीं कर सकती",
            "कोई रास्ता नहीं",
            "मैं कुछ नहीं कर सकती",
        ],

        "support_need": [
            # English
            "help",
            "support",
            "counselling",
            "counseling",
            "police",
            "legal help",
            "need assistance",

            # Tamil
            "உதவி",
            "ஆதரவு",
            "ஆலோசனை",
            "காவல்துறை",
            "காவல்துறையிடம்",
            "சட்ட உதவி",
            "உதவி வேண்டும்",

            # Hindi
            "मदद",
            "सहायता",
            "समर्थन",
            "परामर्श",
            "पुलिस",
            "कानूनी मदद",
            "मदद चाहिए",
        ],
    }

    indicators = {}

    for name, keywords in patterns.items():
        matches = [
            keyword
            for keyword in keywords
            if keyword in text_lower
        ]

        indicators[name] = {
            "detected": len(matches) > 0,
            "matches": matches,
        }

    return indicators


def calculate_svi_score(indicators, sentiment_score):
    """
    Prototype SVI screening score.

    The score combines detected support-related indicators
    with the NLP sentiment confidence.
    """

    score = round(sentiment_score * 50)

    weights = {
        "distress": 10,
        "fear": 15,
        "safety": 20,
        "helplessness": 10,
        "support_need": 5,
    }

    for name, weight in weights.items():
        if indicators[name]["detected"]:
            score += weight

    return min(score, 100)


@router.post("/{complaint_id}")
def analyze_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.complaint_id == complaint_id,
            Complaint.user_id == current_user.id,
        )
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found.",
        )

    if not complaint.complaint_text:
        raise HTTPException(
            status_code=400,
            detail="Complaint text is empty.",
        )

    complaint_text = complaint.complaint_text

    # ---------------------------------------------------------
    # NLP SENTIMENT
    # ---------------------------------------------------------

    result = sentiment_analyzer(
        complaint_text[:512]
    )[0]

    label = result["label"]
    confidence = float(result["score"])

    # ---------------------------------------------------------
    # DYNAMIC INDICATORS
    # ---------------------------------------------------------

    indicators = detect_indicators(complaint_text)

    # ---------------------------------------------------------
    # DYNAMIC SVI SCORE
    # ---------------------------------------------------------

    svi_score = calculate_svi_score(
        indicators,
        confidence,
    )

    # ---------------------------------------------------------
    # PRIORITY
    # ---------------------------------------------------------

    if svi_score >= 75:
        priority = "URGENT"
    elif svi_score >= 50:
        priority = "HIGH"
    elif svi_score >= 25:
        priority = "MODERATE"
    else:
        priority = "LOW"

    # ---------------------------------------------------------
    # SAFETY STATUS
    # ---------------------------------------------------------

    safety_concern = indicators["safety"]["detected"]

    # ---------------------------------------------------------
    # SUPPORT RECOMMENDATION
    # ---------------------------------------------------------

    if safety_concern:
        recommendation = (
            "Immediate safety support and human review recommended."
        )
    elif indicators["support_need"]["detected"]:
        recommendation = (
            "Human support and counselling assistance recommended."
        )
    elif priority == "HIGH":
        recommendation = (
            "Priority human review recommended."
        )
    elif priority == "MEDIUM":
        recommendation = (
            "Support review recommended."
        )
    else:
        recommendation = (
            "Continue with standard support process."
        )

    # ---------------------------------------------------------
    # UPDATE COMPLAINT
    # ---------------------------------------------------------

    complaint.status = "under_assessment"

    db.commit()
    db.refresh(complaint)

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "complaint_id": complaint.complaint_id,
        "svi_score": svi_score,
        "priority": priority,
        "sentiment": label,
        "confidence": round(confidence, 4),
        "status": complaint.status,
        "indicators": indicators,
        "safety_concern": safety_concern,
        "recommendation": recommendation,
    }