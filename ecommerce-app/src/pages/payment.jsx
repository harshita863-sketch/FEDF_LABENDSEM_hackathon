import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Styles ---------- */

const css = `
.pay-body{
    background:#f1f3f6;
    font-family:Arial, Helvetica, sans-serif;
    min-height:100vh;
}

.pay-body *{
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

.pay-page{
    max-width:480px;
    margin:0 auto;
    min-height:100vh;
    background:#f5f5f5;
    padding-bottom:30px;
}

.pay-topbar{
    display:flex;
    align-items:center;
    gap:15px;
    background:white;
    padding:15px 18px;
    box-shadow:0 1px 4px rgba(0,0,0,0.15);
    position:sticky;
    top:0;
    z-index:10;
}

.pay-topbar .back{
    font-size:22px;
    cursor:pointer;
    color:#333;
    background:none;
    border:none;
}

.pay-topbar h1{
    font-size:18px;
    color:#222;
    flex:1;
}

.pay-topbar .help{
    border:1px solid #ccc;
    background:white;
    padding:7px 18px;
    border-radius:8px;
    font-size:14px;
    cursor:pointer;
}

.pay-card{
    background:white;
    border-radius:12px;
    margin:14px 14px 0;
    padding:16px;
    box-shadow:0 0 6px rgba(0,0,0,0.08);
}

.status{
    display:flex;
    align-items:center;
    gap:12px;
    border:1px solid #ddd;
    border-radius:10px;
    padding:14px;
}

.status-icon{
    width:30px;
    height:30px;
    min-width:30px;
    background:#28a745;
    color:white;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:18px;
    font-weight:bold;
}

.status h2{
    font-size:17px;
    color:#1b7a34;
}

.status p{
    font-size:13px;
    color:#555;
    margin-top:3px;
}

.status.cancelled{
    border-color:#f1b0b7;
    background:#fdf1f2;
}

.status.cancelled .status-icon{
    background:#dc3545;
}

.status.cancelled h2{
    color:#dc3545;
}

.order-id{
    font-size:13px;
    color:#666;
    margin-bottom:12px;
}

.item{
    display:flex;
    justify-content:space-between;
    gap:10px;
    padding:10px 0;
    border-bottom:1px solid #eee;
    font-size:15px;
}

.item:last-child{
    border-bottom:none;
}

.item .qty{
    font-size:13px;
    color:#777;
}

.section-head{
    font-size:17px;
    font-weight:bold;
    color:#222;
    margin-bottom:14px;
}

.row{
    display:flex;
    gap:12px;
    align-items:flex-start;
    padding:10px 0;
    font-size:14px;
    color:#333;
    border-bottom:1px solid #eee;
}

.row:last-child{
    border-bottom:none;
}

.row .icon{
    font-size:16px;
    width:20px;
}

.row b{
    margin-right:6px;
}

.price-row{
    display:flex;
    justify-content:space-between;
    padding:7px 0;
    font-size:14px;
    color:#444;
}

.price-row.total{
    border-top:1px dashed #bbb;
    margin-top:8px;
    padding-top:12px;
    font-size:17px;
    font-weight:bold;
    color:#111;
}

.paid{
    margin-top:10px;
    font-size:13px;
    color:#1b7a34;
    background:#e8f6ec;
    border-radius:6px;
    padding:8px 10px;
}

.paid.cancelled{
    color:#b02a37;
    background:#fdecee;
}

.shop-btn{
    display:block;
    width:calc(100% - 28px);
    margin:20px 14px 0;
    padding:14px;
    background:#7851a9;
    color:white;
    text-align:center;
    border:none;
    border-radius:8px;
    font-size:16px;
    font-weight:bold;
    cursor:pointer;
}

.shop-btn:hover{
    background:#5e3d85;
}

.cancel-btn{
    display:block;
    width:calc(100% - 28px);
    margin:14px 14px 0;
    padding:14px;
    background:white;
    color:#dc3545;
    border:2px solid #dc3545;
    border-radius:8px;
    font-size:16px;
    font-weight:bold;
    cursor:pointer;
    transition:0.3s;
}

.cancel-btn:hover{
    background:#dc3545;
    color:white;
}

.pay-overlay{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.6);
    z-index:50;
    display:flex;
    align-items:center;
    justify-content:center;
}

.dialog{
    background:white;
    width:90%;
    max-width:400px;
    border-radius:12px;
    padding:22px;
}

.dialog h3{
    color:#dc3545;
    margin-bottom:6px;
}

.dialog p{
    font-size:14px;
    color:#555;
    margin-bottom:12px;
}

.dialog select{
    width:100%;
    padding:10px;
    border:2px solid #ddd;
    border-radius:6px;
    font-size:15px;
}

.dialog-buttons{
    display:flex;
    gap:10px;
    margin-top:18px;
}

.dialog-buttons button{
    flex:1;
    padding:11px;
    border:none;
    border-radius:6px;
    font-size:15px;
    cursor:pointer;
}

.keep{
    background:#eee;
    color:#333;
}

.confirm{
    background:#dc3545;
    color:white;
}

.pay-empty{
    text-align:center;
    padding:60px 20px;
    color:#666;
}

.pay-empty button{
    margin-top:15px;
    background:none;
    border:none;
    color:#7851a9;
    font-weight:bold;
    font-size:16px;
    cursor:pointer;
}
`;

/* ---------- Storage helper ---------- */

function load(key, fallback){
    try{
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    }
    catch(error){
        return fallback;
    }
}

/* ---------- Load latest order ---------- */

function loadOrder(){

    const last = load("lastOrder", null);

    if(!last){
        return null;
    }

    const orders = load("shopOrders", []);

    const found = orders.find(function(o){
        return o.id == last.id;
    });

    return found || last;
}

/* ---------- Main component ---------- */

export default function Payment(){

    const navigate = useNavigate();

    const [order, setOrder] = useState(loadOrder);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [reason, setReason] = useState("Ordered by mistake");

    /* Go back to Dashboard */

    function goShop(){
        navigate("/dashboard");
    }

    /* Cancel order */

    function cancelOrder(){

        if(!order){
            return;
        }

        const cancelled = {
            ...order,
            status:"Cancelled",
            cancelReason:reason
        };

        // Update saved orders
        const allOrders = load("shopOrders", []).map(function(o){
            return o.id == cancelled.id
                ? cancelled
                : o;
        });

        localStorage.setItem(
            "shopOrders",
            JSON.stringify(allOrders)
        );

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(cancelled)
        );

        // Restore product stock
        const savedProducts = load("shopProducts", null);

        if(savedProducts != null && Array.isArray(cancelled.items)){

            const updated = savedProducts.map(function(p){

                const item = cancelled.items.find(function(it){
                    return it.id == p.id;
                });

                return item
                    ? { ...p, stock:Number(p.stock || 0) + Number(item.qty || 0) }
                    : p;
            });

            localStorage.setItem(
                "shopProducts",
                JSON.stringify(updated)
            );
        }

        setOrder(cancelled);
        setCancelOpen(false);
    }

    /* ---------- No order found ---------- */

    if(order == null){

        return (
            <div className="pay-body">
                <style>{css}</style>

                <div className="pay-page">
                    <div className="pay-empty">
                        <h2>No recent order found.</h2>
                        <p>Please place an order first.</p>

                        <button onClick={goShop}>
                            Go back to shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- Order details ---------- */

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const totalQty = items.reduce(function(sum, it){
        return sum + Number(it.qty || 0);
    }, 0);

    const isCancelled = order.status === "Cancelled";

    const canCancel =
        order.status === "Placed" ||
        order.status === "Packed";

    let title = "Order Placed";
    let text = "Your order will be delivered soon";

    if(isCancelled){

        title = "Order Cancelled";
        text = "Your order has been cancelled.";

    }
    else if(order.status === "Delivered"){

        title = "Order Delivered";
        text = "Your order has been delivered.";

    }
    else if(order.status === "Shipped"){

        title = "Order Shipped";
        text = "Your order is on the way and will be delivered soon";

    }
    else if(order.status === "Packed"){

        title = "Order Packed";
        text = "Your order has been packed.";

    }

    /* ---------- Expected delivery ---------- */

    let expected = "";

    if(isCancelled){

        if(order.cancelReason){
            expected = "Reason: " + order.cancelReason;
        }

    }
    else if(order.status !== "Delivered"){

        const d = new Date();
        d.setDate(d.getDate() + 5);

        expected = "Expected by " +
            d.toLocaleDateString("en-IN", {
                weekday:"short",
                day:"numeric",
                month:"short"
            });
    }

    /* ---------- Payment note ---------- */

    let paidText = "";

    if(isCancelled){

        paidText = order.payment === "Cash on Delivery"
            ? "No payment was taken. Nothing to refund."
            : "This is a demo order. Refunds are not processed by this website.";

    }
    else{

        paidText = order.payment === "Cash on Delivery"
            ? "Payment: Cash on Delivery - pay ₹" + order.total + " when delivered"
            : "Demo payment method: " + order.payment;

    }

    /* ---------- Screen ---------- */

    return (

        <div className="pay-body">

            <style>{css}</style>

            <div className="pay-page">

                {/* Top bar */}

                <div className="pay-topbar">

                    <button
                        className="back"
                        onClick={goShop}
                    >
                        &#8592;
                    </button>

                    <h1>Order Details</h1>

                    <button
                        className="help"
                        onClick={function(){
                            alert("Contact support: support@ecommerce.com");
                        }}
                    >
                        Help
                    </button>

                </div>

                {/* Order status */}

                <div className="pay-card">

                    <p className="order-id">
                        Order #{order.id} &nbsp;|&nbsp; {order.date}
                    </p>

                    <div className={"status" + (isCancelled ? " cancelled" : "")}>

                        <div className="status-icon">
                            {isCancelled ? "✕" : "✓"}
                        </div>

                        <div>
                            <h2>{title}</h2>
                            <p>{text}</p>

                            {expected !== "" && (
                                <p>{expected}</p>
                            )}
                        </div>

                    </div>

                </div>

                {/* Items ordered */}

                <div className="pay-card">

                    <div className="section-head">
                        Items Ordered
                    </div>

                    {items.map(function(it, i){

                        return (

                            <div className="item" key={i}>

                                <div>
                                    {it.name}
                                    <br />

                                    <span className="qty">
                                        Qty: {it.qty}
                                    </span>
                                </div>

                                <div>
                                    ₹{Number(it.price || 0) * Number(it.qty || 0)}
                                </div>

                            </div>

                        );
                    })}

                </div>

                {/* Delivery details */}

                <div className="pay-card">

                    <div className="section-head">
                        Delivery details
                    </div>

                    <div className="row">

                        <span className="icon">📍</span>

                        <div>
                            <b>Address</b>
                            <span>{order.address || "Not provided"}</span>
                        </div>

                    </div>

                    <div className="row">

                        <span className="icon">👤</span>

                        <div>
                            <b>{order.name || "Customer"}</b>
                            <span>{order.phone || "Not provided"}</span>
                        </div>

                    </div>

                    {order.email && (
                        <div className="row">
                            <span className="icon">✉️</span>
                            <div>
                                <b>Email</b>
                                <span>{order.email}</span>
                            </div>
                        </div>
                    )}

                </div>

                {/* Price details */}

                <div className="pay-card">

                    <div className="section-head">
                        Price details
                    </div>

                    <div className="price-row">

                        <span>
                            Price ({totalQty} item{totalQty > 1 ? "s" : ""})
                        </span>

                        <span>
                            ₹{order.total}
                        </span>

                    </div>

                    <div className="price-row">

                        <span>Delivery Charges</span>

                        <span style={{ color:"#1b7a34" }}>
                            FREE
                        </span>

                    </div>

                    <div className="price-row total">

                        <span>Total Amount</span>

                        <span>
                            ₹{order.total}
                        </span>

                    </div>

                    <div className={"paid" + (isCancelled ? " cancelled" : "")}>
                        {paidText}
                    </div>

                </div>

                {/* Cancel order button */}

                {canCancel && (

                    <button
                        className="cancel-btn"
                        onClick={function(){
                            setCancelOpen(true);
                        }}
                    >
                        Cancel Order
                    </button>

                )}

                {/* Continue shopping */}

                <button
                    className="shop-btn"
                    onClick={goShop}
                >
                    Continue Shopping
                </button>

            </div>

            {/* Cancel confirmation popup */}

            {cancelOpen && (

                <div className="pay-overlay">

                    <div className="dialog">

                        <h3>Cancel this order?</h3>

                        <p>
                            Please tell us why you want to cancel.
                        </p>

                        <select
                            value={reason}
                            onChange={function(e){
                                setReason(e.target.value);
                            }}
                        >

                            <option>Ordered by mistake</option>

                            <option>Found a better price</option>

                            <option>Delivery is taking too long</option>

                            <option>Want to change address or item</option>

                            <option>Other</option>

                        </select>

                        <div className="dialog-buttons">

                            <button
                                className="keep"
                                onClick={function(){
                                    setCancelOpen(false);
                                }}
                            >
                                Keep Order
                            </button>

                            <button
                                className="confirm"
                                onClick={cancelOrder}
                            >
                                Yes, Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
