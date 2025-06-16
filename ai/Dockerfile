FROM python:latest AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
COPY app.py .
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
EXPOSE 8888
CMD ["gunicorn", "-w", "4", "--bind", "0.0.0.0:8888", "app:app"]
