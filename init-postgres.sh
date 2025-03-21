#!/bin/bash

# Configuration variables
POSTGRES_CONTAINER_NAME="local_docker-postgresql-1"
POSTGRES_DB="migla_db"
POSTGRES_USER="migla_admin"
POSTGRES_PASSWORD="yoahdgoaiwgpho435893das"
POSTGRES_PORT=5432

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if the container is already running
if [ "$(docker ps -q -f name=$POSTGRES_CONTAINER_NAME)" ]; then
    echo "✅ PostgreSQL container '$POSTGRES_CONTAINER_NAME' is already running."
else
    echo "🚀 Starting PostgreSQL container..."
    docker run -d \
        --name $POSTGRES_CONTAINER_NAME \
        -e POSTGRES_DB=$POSTGRES_DB \
        -e POSTGRES_USER=$POSTGRES_USER \
        -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
        -p $POSTGRES_PORT:5432 \
        postgres:15

    echo "⏳ Waiting for PostgreSQL to start..."
    sleep 5
fi

# Wait for PostgreSQL to be ready
until docker exec $POSTGRES_CONTAINER_NAME pg_isready -U $POSTGRES_USER > /dev/null 2>&1; do
    echo "⏳ Waiting for PostgreSQL to become ready..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Create database if it doesn't exist
echo "🔧 Checking if database exists..."
DB_EXISTS=$(docker exec -i $POSTGRES_CONTAINER_NAME psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'")

if [ "$DB_EXISTS" != "1" ]; then
    echo "📂 Creating database '$POSTGRES_DB'..."
    docker exec -i $POSTGRES_CONTAINER_NAME psql -U postgres -c "CREATE DATABASE $POSTGRES_DB;"
else
    echo "✅ Database '$POSTGRES_DB' already exists."
fi

# Create user and grant privileges
echo "🔧 Checking if user exists..."
USER_EXISTS=$(docker exec -i $POSTGRES_CONTAINER_NAME psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$POSTGRES_USER'")

if [ "$USER_EXISTS" != "1" ]; then
    echo "👤 Creating user '$POSTGRES_USER'..."
    docker exec -i $POSTGRES_CONTAINER_NAME psql -U postgres -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
else
    echo "✅ User '$POSTGRES_USER' already exists."
fi

echo "🔑 Granting privileges..."
docker exec -i $POSTGRES_CONTAINER_NAME psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

echo "🎉 PostgreSQL database and user setup completed!"

# Output environment variables for PayloadCMS
echo ""
echo "🔑 Add this to your .env file:"
echo "--------------------------------------"
echo "DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB"
echo "--------------------------------------"
echo ""

echo "🚀 Now you can start PayloadCMS!"