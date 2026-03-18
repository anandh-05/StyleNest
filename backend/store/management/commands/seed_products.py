from django.core.management.base import BaseCommand

from store.models import Product, ProductImage


PRODUCTS = [
    {
        "name": "Harbor Overshirt",
        "description": "A heavyweight overshirt with a structured drape, brushed finish, and all-day layering comfort.",
        "price": "79.00",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        "category": "clothing",
        "stock": 18,
        "size": "L",
        "color": "Sand",
    },
    {
        "name": "Transit Runner",
        "description": "Lightweight city sneakers designed with cushioned midsoles and breathable knit uppers.",
        "price": "119.00",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        "category": "shoes",
        "stock": 12,
        "size": "M",
        "color": "Coral",
    },
    {
        "name": "Field Tote",
        "description": "Everyday utility tote with reinforced handles, interior pocketing, and weather-ready canvas.",
        "price": "54.00",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "category": "accessories",
        "stock": 24,
        "size": "XL",
        "color": "Olive",
    },
    {
        "name": "Northline Jacket",
        "description": "Technical outerwear with a matte shell, warm lining, and modern relaxed silhouette.",
        "price": "149.00",
        "image": "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
        "category": "outerwear",
        "stock": 8,
        "size": "XL",
        "color": "Midnight",
    },
    {
        "name": "Studio Track Pant",
        "description": "Tapered athleisure pants with stretch fabric, zip pockets, and a clean tailored finish.",
        "price": "68.00",
        "image": "https://images.unsplash.com/photo-1506629905607-bb5b26c1f76b?auto=format&fit=crop&w=900&q=80",
        "category": "athleisure",
        "stock": 16,
        "size": "M",
        "color": "Slate",
    },
    {
        "name": "Nomad Tee",
        "description": "A premium cotton tee with a soft hand feel, relaxed neckline, and durable stitching.",
        "price": "32.00",
        "image": "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80",
        "category": "clothing",
        "stock": 30,
        "size": "S",
        "color": "Ivory",
    },
    {
        "name": "Summit Hoodie",
        "description": "Midweight brushed hoodie with a roomy fit, ribbed cuffs, and premium fleece interior.",
        "price": "72.00",
        "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        "category": "clothing",
        "stock": 22,
        "size": "XL",
        "color": "Heather Grey",
    },
    {
        "name": "Canvas Work Shirt",
        "description": "Structured utility shirt with buttoned chest pockets and a rugged washed finish.",
        "price": "64.00",
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
        "category": "clothing",
        "stock": 15,
        "size": "L",
        "color": "Rust",
    },
    {
        "name": "Pace Trainer",
        "description": "Performance trainer with responsive cushioning and a flexible outsole for daily miles.",
        "price": "129.00",
        "image": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80",
        "category": "shoes",
        "stock": 10,
        "size": "M",
        "color": "Cloud White",
    },
    {
        "name": "Metro High-Top",
        "description": "Street-inspired high-top sneaker with padded collar support and contrast paneling.",
        "price": "136.00",
        "image": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80",
        "category": "shoes",
        "stock": 9,
        "size": "L",
        "color": "Graphite",
    },
    {
        "name": "Weekender Duffel",
        "description": "Travel-ready duffel with durable straps, a shoe compartment, and water-resistant shell.",
        "price": "88.00",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        "category": "accessories",
        "stock": 14,
        "size": "XL",
        "color": "Cocoa",
    },
    {
        "name": "Orbit Cap",
        "description": "Low-profile cotton twill cap with embroidered detailing and adjustable back strap.",
        "price": "26.00",
        "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
        "category": "accessories",
        "stock": 28,
        "size": "S",
        "color": "Forest",
    },
    {
        "name": "Harbor Beanie",
        "description": "Soft rib-knit beanie designed for cold mornings and easy everyday layering.",
        "price": "24.00",
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
        "category": "accessories",
        "stock": 25,
        "size": "M",
        "color": "Charcoal",
    },
    {
        "name": "Storm Parka",
        "description": "Insulated parka with a storm flap, extended hem, and weather-blocking shell fabric.",
        "price": "189.00",
        "image": "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
        "category": "outerwear",
        "stock": 7,
        "size": "XL",
        "color": "Deep Navy",
    },
    {
        "name": "Aero Windbreaker",
        "description": "Packable lightweight jacket with contrast zipper details and breathable mesh lining.",
        "price": "94.00",
        "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        "category": "outerwear",
        "stock": 13,
        "size": "M",
        "color": "Sky Blue",
    },
    {
        "name": "Motion Quarter Zip",
        "description": "Stretch performance layer with moisture-wicking fabric and a sleek athletic profile.",
        "price": "58.00",
        "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        "category": "athleisure",
        "stock": 19,
        "size": "L",
        "color": "Berry",
    },
    {
        "name": "Core Training Short",
        "description": "Breathable training shorts with quick-dry lining and secure side pockets.",
        "price": "42.00",
        "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        "category": "athleisure",
        "stock": 21,
        "size": "M",
        "color": "Black",
    },
]

CATEGORY_GALLERY_IMAGES = {
    "clothing": [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    ],
    "shoes": [
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    ],
    "accessories": [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
    ],
    "outerwear": [
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
    ],
    "athleisure": [
        "https://images.unsplash.com/photo-1506629905607-bb5b26c1f76b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    ],
}


class Command(BaseCommand):
    help = "Seed the database with sample products"

    def handle(self, *args, **options):
        created_count = 0
        for product_data in PRODUCTS:
            product, created = Product.objects.update_or_create(
                name=product_data["name"],
                defaults=product_data,
            )
            if created:
                created_count += 1

            gallery_urls = [product_data["image"], *CATEGORY_GALLERY_IMAGES.get(product_data["category"], [])]
            unique_gallery_urls = list(dict.fromkeys(url for url in gallery_urls if url))[:4]

            for index, image_url in enumerate(unique_gallery_urls):
                ProductImage.objects.update_or_create(
                    product=product,
                    sort_order=index,
                    defaults={
                        "image": image_url,
                        "alt_text": f"{product.name} view {index + 1}",
                    },
                )

            product.gallery_images.exclude(sort_order__lt=len(unique_gallery_urls)).delete()

        self.stdout.write(self.style.SUCCESS(f"Seed complete. New products created: {created_count}"))
