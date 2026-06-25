import smtplib
from email.message import EmailMessage

from app.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, FRONTEND_URL


def send_password_reset_email(to_email: str, token: str):
    missing = [
        name for name, value in [
            ("SMTP_HOST", SMTP_HOST),
            ("SMTP_PORT", SMTP_PORT),
            ("SMTP_USER", SMTP_USER),
            ("SMTP_PASSWORD", SMTP_PASSWORD),
            ("SMTP_FROM", SMTP_FROM),
        ]
        if not value
    ]
    if missing:
        raise RuntimeError(
            f"SMTP configuration missing: {', '.join(missing)}. "
            "Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM in .env."
        )

    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message["Subject"] = "Reset Kata Sandi DariNadi"

    reset_link = f"{FRONTEND_URL}/reset_password?token={token}"
    message.set_content(
        f"Halo,\n\nUntuk mereset kata sandi Anda, silakan gunakan token berikut:\n\n{token}\n\n" \
        f"Token ini berlaku selama 30 menit.\n\n" \
        f"Jika aplikasi Anda mendukung tautan reset, Anda dapat mengklik atau menempel tautan berikut di browser:\n{reset_link}\n\n" \
        "Jika Anda tidak meminta reset sandi, abaikan email ini.\n\n" \
        "Salam,\nTim DariNadi"
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(message)
