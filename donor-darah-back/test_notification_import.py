from dotenv import load_dotenv
load_dotenv()
from app.routers.notification import router
from app.crud.notification import create_notification
print('notification imports ok')
