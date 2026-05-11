import psycopg2

conn = psycopg2.connect(
    dbname="ecommerce",
    user="admin",
    password="1234",
    host="localhost"
)

print("Conectado correctamente 🚀")
conn.close()