import React from 'react';
import Sidebar from '../other/Sidebar';
import { hex, motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';
import axios from '../../config/axios';
import toast from 'react-hot-toast';
import loadRazorpay from '../../utils/LoadRazorpay';

const plans = [
	{
		id: 'basic',
		name: 'Monthly',
		price: { amount: 10, currency: 'USD', period: 'month' },
		description: 'Ideal for individuals and short-term projects.',
		discount: null,
		features: [
			'Unlimited access to core features',
			'Email & chat support',
			'Basic usage analytics',
		],
		cta: 'Subscribe Monthly',
	},
	{
		id: 'standard',
		name: '6-Month',
		price: { amount: 50, currency: 'USD', period: '6 months' },
		description: 'Perfect for small teams—8% savings vs. monthly.',
		discount: { label: '8% savings', amount: 10 },
		features: [
			'Everything in Monthly',
			'Priority email & chat support',
			'Advanced analytics & reporting',
			'Team collaboration tools',
		],
		cta: 'Subscribe 6‑Month',
	},
	{
		id: 'premium',
		name: 'Yearly',
		price: { amount: 90, currency: 'USD', period: 'year' },
		description: 'Best value for long-term growth—17% savings vs. monthly.',
		discount: { label: '17% savings', amount: 30 },
		features: [
			'Everything in 6‑Month',
			'Dedicated account manager',
			'Customizable reporting dashboard',
			'Early access to new features & beta programs',
		],
		cta: 'Subscribe Yearly',
	},
];

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: 'spring', stiffness: 200, damping: 20 },
	},
};

export default function Pricing() {
	const { isSidebarOpen } = useSidebar();

	const paymentHandler = async (planId, e) => {
		const res = await loadRazorpay();
		if (!res) {
			toast.error('Razorpay SDK failed to load.');
			return;
		}

		const plan = plans.find((p) => p.id === planId);
		if (!plan) {
			toast.error('Invalid plan selected.');
			return;
		}

		try {
			const response = await axios.post('/api/payments/create', {
				amount: plan.price.amount * 100, // Convert to currency subunits
				currency: plan.price.currency,
				planId: plan.id,
			});

			const options = {
				key: import.meta.env.VITE_API_RAZORPAY_KEY_SECRET, // Replace with your Razorpay key ID
				amount: response.data.amount,
				currency: response.data.currency,
				name: 'FusionAI',
				description: plan.description,
				order_id: response.data.orderId,
				handler: async function (response) {
					try {
						await axios.post('/api/payments/verify', {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							amount: plan.price.amount * 100,
							currency: plan.price.currency,
							planId: plan.id,
						});
						toast.success('Payment verified successfully.');
					} catch (error) {
						console.error(error);
						toast.error('Payment verification failed.');
					}
				},
				prefill: {
					name: response.data.user.name,
                    email: response.data.user.email,
					contact: '9000090000',
				},
				notes: {
					address: 'Razorpay Corporate Office',
				},
				theme: {
					color: '#3399cc',
				},
			};

			const rzp = new window.Razorpay(options);
			rzp.open();
		} catch (error) {
			console.error(error);
			toast.error('Payment initialization failed.');
		}
	};

	return (
		<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			{/* Sidebar */}
			<motion.aside
				layout
				initial={false}
				animate={{ width: isSidebarOpen ? 200 : 64 }}
				transition={{ type: 'spring', stiffness: 210, damping: 20 }}
				className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30"
			>
				<Sidebar />
			</motion.aside>

			{/* Main Content */}
			<motion.main
				layout
				className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
			>
				<header className="text-center py-12">
					<motion.h1
						className="text-5xl font-extrabold tracking-tight mb-4"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						Pricing Plans
					</motion.h1>
					<motion.p
						className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Choose the plan that fits your needs and grow your projects.
					</motion.p>
				</header>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{plans.map((plan, i) => (
						<motion.div
							key={plan.id}
							className="flex flex-col justify-between p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
							variants={cardVariants}
							custom={i}
						>
							<div>
								<h2 className="text-2xl font-bold mb-2">{plan.name} Plan</h2>
								<p className="text-4xl font-extrabold mb-1">
									{plan.price.currency} {plan.price.amount}/
									<span className="text-base font-medium">
										{plan.price.period}
									</span>
								</p>
								<p className="text-gray-600 dark:text-gray-400 mb-4">
									{plan.description}
								</p>

								<ul className="mb-6 space-y-2">
									{plan.features.map((feature, idx) => (
										<li key={idx} className="flex items-start">
											<span className="text-green-500 mr-2">✓</span>
											<span className="text-gray-700 dark:text-gray-300">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>

							<div className="space-y-4">
								{plan.discount && (
									<p className="text-green-600 font-semibold">
										{plan.discount.label}
									</p>
								)}
								<motion.button
									whileTap={{ scale: 0.95 }}
									id={`rzp-button-1`}
									className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
									onClick={() => paymentHandler(plan.id)}
								>
									{plan.cta}
								</motion.button>
							</div>
						</motion.div>
					))}
				</motion.div>
			</motion.main>
		</div>
	);
}



