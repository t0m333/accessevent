# Руководство администратора AccessEvent

## 1. Системные требования

- Python 3.11+
- PostgreSQL 15+
- Git для клонирования репозитория

## 2. Развёртывание

Локально:

1. Клонировать репозиторий: `git clone <url>`
2. Создать виртуальное окружение: `python -m venv venv`
3. Активировать: `venv\Scripts\activate` (Windows) или `source venv/bin/activate` (macOS/Linux)
4. Установить зависимости: `pip install -r requirements.txt`
5. Настроить `.env` (см. раздел 3)
6. Запустить: `python app.py`

## 3. Переменные окружения (.env)

| Переменная | Назначение | Пример |
|---|---|---|
| DATABASE_URL | Подключение к PostgreSQL | postgresql://postgres:пароль@localhost:5432/accessevent |
| SECRET_KEY | Ключ подписи JWT | произвольная длинная строка |
| TESTING | Переключение на тестовую SQLite (только для тестов) | 1 |

## 4. Роли и права

| Роль | Права |
|---|---|
| guest | просмотр мероприятий |
| user | регистрация на мероприятия, личный кабинет |
| organizer | всё user + создание/редактирование своих мероприятий |
| admin | всё organizer + модерация и блокировка |

## 5. Резервное копирование

Создание дампа базы:
```
pg_dump -U postgres accessevent > backup_2026-11-01.sql
```

Восстановление:
```
psql -U postgres accessevent < backup_2026-11-01.sql
```

Рекомендуется делать дамп ежедневно по расписанию, хранить 30 дней.

## 6. Мониторинг

- Проверка работы сервиса: `http://localhost:5000/` должен возвращать 200.
- Логи приложения: вывод в консоль (в production рекомендуется файл или journald).
- Логи PostgreSQL: стандартные системные логи СУБД.

## 7. Типовые проблемы и решения

| Симптом | Причина | Решение |
|---|---|---|
| Password authentication failed | Неверный пароль в .env | Вписать реальный пароль postgres |
| Connection refused | Не запущен PostgreSQL | Запустить службу postgresql |
| Address already in use (порт 5000) | Старый процесс python | Закрыть процесс или сменить порт |
| Таблицы не создаются | Не вызван db.create_all() | Проверить app.py |
| ModuleNotFoundError | Запуск не из корня проекта | cd accessevent и повторить |
| 401 Токен отсутствует | Нет заголовка Authorization | Добавить: Authorization: Bearer <token> |

## 8. Обновление приложения

1. `git pull origin main`
2. `pip install -r requirements.txt` (если менялись зависимости)
3. Перезапустить сервер (Ctrl+C → python app.py)
4. Проверить логи на ошибки