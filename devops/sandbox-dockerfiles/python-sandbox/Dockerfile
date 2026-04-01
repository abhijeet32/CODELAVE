FROM python:3.14.3-alpine

RUN apk add --no-cache gcc musl-dev

RUN addgroup -S sandboxgroup && adduser -S sandboxuser -G sandboxgroup

WORKDIR /app

COPY --chown=sandboxuser:sandboxgroup requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

USER sandboxuser

ENV PYTHONDONTWRITEBYTECODE=1

CMD [ "python" ]