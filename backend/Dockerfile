FROM python:3.11-slim

WORKDIR /app

# Install system compiler tools for C++, Java, and Node
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    default-jdk \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "codepractice.wsgi:application"]
