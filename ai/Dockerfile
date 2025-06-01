FROM alpine:latest AS builder
WORKDIR /app
RUN apt-get update
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM alpine:latest AS production
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY app.py .
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
EXPOSE 8888
CMD ["flask", "run"]
