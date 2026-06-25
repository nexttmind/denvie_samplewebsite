
-- ROLES
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "profiles self write" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  insert into public.user_roles (user_id, role) values (new.id, 'customer');
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

-- ADDRESSES
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  region text,
  is_default boolean default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;
alter table public.addresses enable row level security;
create policy "address owner all" on public.addresses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- CATEGORIES & COLLECTIONS
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  banner_url text,
  sort_order int default 0,
  is_featured boolean default false,
  created_at timestamptz not null default now()
);
grant select on public.collections to anon, authenticated;
grant all on public.collections to service_role;
alter table public.collections enable row level security;
create policy "collections public read" on public.collections for select to anon, authenticated using (true);
create policy "collections admin write" on public.collections for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  stock int not null default 0,
  sku text,
  is_active boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  is_bestseller boolean default false,
  is_sale boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
create policy "products admin write" on public.products for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create index on public.products(category_id);
create index on public.products(collection_id);

-- WISHLIST
create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
grant select, insert, delete on public.wishlist to authenticated;
grant all on public.wishlist to service_role;
alter table public.wishlist enable row level security;
create policy "wishlist owner all" on public.wishlist for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- CART
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size text,
  color text,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.cart_items to authenticated;
grant all on public.cart_items to service_role;
alter table public.cart_items enable row level security;
create policy "cart owner all" on public.cart_items for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- COUPONS
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage','fixed','free_shipping')),
  discount_value numeric(10,2) not null default 0,
  min_order numeric(10,2) default 0,
  usage_limit int,
  used_count int not null default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz not null default now()
);
grant select on public.coupons to authenticated;
grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
create policy "coupons public read active" on public.coupons for select to authenticated using (is_active = true);
create policy "coupons admin write" on public.coupons for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ORDERS
create type public.order_status as enum ('pending','processing','shipped','delivered','cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('DV-' || to_char(now(),'YYMMDD') || '-' || substr(gen_random_uuid()::text,1,6)),
  user_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'pending',
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_region text,
  payment_method text not null default 'cod',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders owner read" on public.orders for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "orders owner insert" on public.orders for insert to authenticated with check (user_id = auth.uid());
create policy "orders admin write" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  size text,
  color text,
  quantity int not null,
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null
);
grant select, insert on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "order_items read via order" on public.order_items for select to authenticated using (
  exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);
create policy "order_items insert via order" on public.order_items for insert to authenticated with check (
  exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- REVIEWS
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now()
);
grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select to anon, authenticated using (true);
create policy "reviews owner write" on public.reviews for insert to authenticated with check (user_id = auth.uid());
create policy "reviews owner update" on public.reviews for update to authenticated using (user_id = auth.uid());
create policy "reviews owner delete" on public.reviews for delete to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- TESTIMONIALS (curated by admin)
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  location text,
  quote text not null,
  rating int default 5,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials public read" on public.testimonials for select to anon, authenticated using (is_active = true);
create policy "testimonials admin write" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- NEWSLETTER
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter public insert" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "newsletter admin read" on public.newsletter_subscribers for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- SEED DATA
insert into public.categories (slug, name, description, sort_order) values
  ('dresses','Dresses','Effortless silhouettes for every occasion',1),
  ('tops','Tops','Elevated essentials for everyday wear',2),
  ('blouses','Blouses','Refined blouses in luxurious fabrics',3),
  ('pants','Pants','Tailored trousers and relaxed silhouettes',4),
  ('skirts','Skirts','From minis to flowing maxis',5),
  ('sets','Sets','Coordinated pieces, effortlessly styled',6);

insert into public.collections (slug, name, description, sort_order, is_featured) values
  ('new-arrivals','New Arrivals','The latest additions to the Dénvie wardrobe',1,true),
  ('best-sellers','Best Sellers','Our most coveted pieces',2,true),
  ('sale','Sale','Beloved pieces at considered prices',3,false);

insert into public.testimonials (author, location, quote, sort_order) values
  ('Maya R.','Beirut','The attention to detail and the quality of the fabrics are unparalleled. Dénvie has become my go-to for effortless elegance.',1),
  ('Layla K.','Jounieh','Every piece feels personal and timeless. The fit is impeccable and the materials are extraordinary.',2),
  ('Nour H.','Tripoli','Finally, a Lebanese brand that understands modern femininity. I receive compliments every time I wear Dénvie.',3);
