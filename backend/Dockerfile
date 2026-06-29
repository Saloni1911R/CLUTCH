FROM python:3.10-slim

WORKDIR /app

# Copy dependencies and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy the rest of the backend code
COPY . .

# Cloud Run forwards traffic to port 8080 by default
EXPOSE 8080

# Start Flask using gunicorn production server
# (Change app:app if your entry file isn't named app.py)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]