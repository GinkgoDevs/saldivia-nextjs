-- =============================================
-- TABLA: models (modelos de buses)
-- =============================================
CREATE TABLE models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('urbano', 'interurbano', 'interprovincial')),
  description TEXT,
  cover_image_url TEXT,
  pdf_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TABLA: products (especificaciones técnicas)
-- =============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- TABLA: spare_parts (repuestos)
-- =============================================
CREATE TABLE spare_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  part_number TEXT UNIQUE NOT NULL,
  model_id UUID REFERENCES models(id) ON DELETE SET NULL,
  description TEXT,
  pdf_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TABLA: contacts (formulario de cotización)
-- =============================================
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT,
  configuration TEXT,
  company TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TABLA: service_requests (soporte técnico)
-- =============================================
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vin TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TABLA: locations (mapa interactivo)
-- =============================================
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('taller', 'distribuidor', 'concesionario')),
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  hours TEXT,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);