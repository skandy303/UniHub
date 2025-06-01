FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/backend

# Install gcc, PostgreSQL and their dependencies
RUN apk add --no-cache --virtual .build-deps gcc musl-dev python3-dev libffi-dev postgresql-dev

COPY . .

RUN pip install -r requirements.txt --no-cache-dir 

# Remove gcc and its dependencies after the installation
RUN apk del .build-deps

EXPOSE 8000

ENTRYPOINT ["python3"]

CMD ["manage.py", "runserver", "0.0.0.0:8000"]