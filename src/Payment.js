import React, { useState } from 'react';
import axios from 'axios';

const Payment = ({ userId, packageId }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Fetch order details from the backend
            const orderResponse = await axios.post(`http://localhost:5000/api/coins/purchase/${userId}`, { packageId });
            // const { order } = orderResponse.data;
            console.log(orderResponse.data, 'order');

            const options = {
                key: 'rzp_test_tcVMNU45whZBG2',
                amount: orderResponse.data.paymentSession.amount,
                currency: orderResponse.data.paymentSession.currency,
                name: 'Bishal Sarma',
                description: `Subscription Plan: 'basic'`,
                order_id: orderResponse.data.paymentSession.id,
                handler: async (response) => {

                    console.log('Frontend - razorpay_order_id:', response.razorpay_order_id);
                    console.log('Frontend - razorpay_payment_id:', response.razorpay_payment_id);
                    console.log('Frontend - razorpay_signature:', response.razorpay_signature);
                    // Payment successful, verify payment on the backend
                    try {
                        const verificationResponse = await axios.post('http://localhost:5000/api/coins/payment/coinverify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId, 
                            planid: packageId
                            
                        });
                        console.log(verificationResponse.data, 'verification response');

                        if (verificationResponse.data.status === true) {
                            alert('Payment verified and subscription created');
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Error verifying payment:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'thenga', // You can fetch this from user data
                    email: 'genga@gmail.com', // You can fetch this from user data
                    contact: '9577632257', // You can fetch this from user data
                },
                theme: {
                    color: '#F37254',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default Payment;
