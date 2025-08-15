'use client';

// Shared types for broadcast messages and Shopify cart mapping

export type MagicJobStatus = {
	status?: 'QUEUED' | 'PROCESSING' | 'READY' | 'ERROR' | string;
	aiJson?: string | Record<string, unknown> | null;
	cartId?: string | null;
	variantId?: string | null;
	jobError?: string | null;
	errorMessage?: string | null;
};

export type MagicBroadcastEvent =
	| { type: 'READY'; job: (MagicJobStatus & { jobId?: string | null }) }
	| { type: 'OPEN_CART' };

export type CartLineNode = {
	id: string;
	quantity: number;
	attributes?: { key: string; value: string }[];
	merchandise: {
		id: string;
		product: { id: string; handle: string; title: string };
		price: { amount: string; currencyCode: string };
		image: { url: string; altText: string | null } | null;
	};
};

export type ShopifyCart = {
	id: string;
	checkoutUrl?: string | null;
	lines?: { edges: { node: CartLineNode }[] };
};


