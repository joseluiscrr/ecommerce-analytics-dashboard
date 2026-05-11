import pandas as pd
from sqlalchemy.orm import Session
from models import Sale, Product

def get_insights(db: Session):
    sales = db.query(Sale).all()
    products = db.query(Product).all()

    sales_data = [
        {
            "product_id": s.product_id,
            "quantity": s.quantity
        }
        for s in sales
    ]

    product_map = {p.id: p for p in products}

    df = pd.DataFrame(sales_data)

    df["price"] = df["product_id"].apply(lambda x: product_map[x].price)
    df["cost"] = df["product_id"].apply(lambda x: product_map[x].cost)

    df["revenue"] = df["price"] * df["quantity"]
    df["profit"] = (df["price"] - df["cost"]) * df["quantity"]

    summary = df.groupby("product_id").sum()

    return summary.to_dict()