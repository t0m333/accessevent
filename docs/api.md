# Описание API AccessEvent

Базовый URL: `http://localhost:5000`

## Таблица эндпоинтов

| Метод | URL | Доступ | Вход (JSON) | Ответы |
|---|---|---|---|---|
| POST | /api/register | все | username, email, password, role | 201 user_id; 400 ошибки валидации |
| POST | /api/login | все | email, password | 200 token; 401 неверные данные |
| GET | /api/events | все | — | 200 список мероприятий |
| GET | /api/events/<id> | все | — | 200 мероприятие; 404 не найдено |
| POST | /api/events | organizer, admin | title, event_date, is_inclusive | 201 id; 401 без токена; 403 нет прав |
| PUT | /api/events/<id> | organizer, admin | title, description, event_date, location | 200; 403 не своё; 404 не найдено |
| DELETE | /api/events/<id> | organizer, admin | — | 200; 403 не своё; 404 не найдено |
| POST | /api/registrations | user | event_id, accessibility_request | 201; 400 повторная; 404 нет события |
| GET | /api/registrations | user | — | 200 список собственных регистраций |
| PUT | /api/registrations/<id> | organizer, admin | status | 200; 400 неверный статус |

## Аутентификация

Все защищённые эндпоинты требуют заголовок:
```
Authorization: Bearer <JWT-токен>
```

Токен выдаётся при успешном POST /api/login. Срок жизни — 24 часа.

## Примеры

### POST /api/register — запрос

```json
{
  "username": "anna",
  "email": "anna@mail.ru",
  "password": "Passw0rd!",
  "role": "user",
  "is_deaf": true
}
```

### Ответ 201

```json
{
  "message": "Пользователь создан",
  "user_id": 1
}
```

### Ответ 400 (ошибка валидации)

```json
{
  "message": "Пароль должен быть не короче 8 символов"
}
```

### POST /api/login — запрос

```json
{
  "email": "anna@mail.ru",
  "password": "Passw0rd!"
}
```

### Ответ 200

```json
{
  "message": "Вход выполнен",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "user_id": 1
}
```

### POST /api/events — запрос (с токеном организатора)

```json
{
  "title": "Тихий кинопросмотр",
  "description": "Инклюзивный показ фильма",
  "event_date": "2026-11-03 19:00:00",
  "location": "Библиотека им. Некрасова",
  "is_inclusive": true,
  "sign_language": true,
  "visual_alerts": true
}
```

### Ответ 201

```json
{
  "message": "Мероприятие создано",
  "id": 5
}
```

### GET /api/events — ответ 200

```json
[
  {
    "id": 5,
    "title": "Тихий кинопросмотр",
    "description": "Инклюзивный показ фильма",
    "event_date": "2026-11-03T19:00:00",
    "location": "Библиотека им. Некрасова",
    "organizer_id": 1,
    "accessibility": {
      "is_inclusive": true,
      "sign_language": true,
      "visual_alerts": true
    }
  }
]
```

### POST /api/registrations — запрос (с токеном участника)

```json
{
  "event_id": 5,
  "accessibility_request": "Нужен сурдоперевод"
}
```

### Ответ 201

```json
{
  "message": "Регистрация создана",
  "id": 1,
  "status": "pending"
}
```

## Коды ошибок

| Код | Значение |
|---|---|
| 200 | OK — успех |
| 201 | Created — ресурс создан |
| 400 | Bad Request — ошибка в данных |
| 401 | Unauthorized — нет или неверный токен |
| 403 | Forbidden — недостаточно прав |
| 404 | Not Found — ресурс не найден |
| 500 | Internal Server Error — ошибка сервера |