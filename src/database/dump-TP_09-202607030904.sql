--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2026-07-03 09:04:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4792 (class 1262 OID 16398)
-- Name: TP_09; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "TP_09" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Argentina.1252';


ALTER DATABASE "TP_09" OWNER TO postgres;

\connect "TP_09"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: publicacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicacion (
    id integer NOT NULL,
    usuariod_id integer,
    url_imagen character varying NOT NULL,
    descripcion character varying,
    likes integer,
    fecha_creacion timestamp without time zone
);


ALTER TABLE public.publicacion OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16406)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre_usuario character varying NOT NULL,
    nombre_completo character varying NOT NULL,
    email character varying,
    password character varying NOT NULL,
    biografia character varying,
    foto_perfil character varying
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 4785 (class 0 OID 16399)
-- Dependencies: 215
-- Data for Name: publicacion; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4786 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4638 (class 2606 OID 16405)
-- Name: publicacion publicacion_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion
    ADD CONSTRAINT publicacion_pk PRIMARY KEY (id);


--
-- TOC entry 4640 (class 2606 OID 16412)
-- Name: usuario usuarios_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuarios_pk PRIMARY KEY (id);


--
-- TOC entry 4641 (class 2606 OID 16413)
-- Name: publicacion publicacion_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicacion
    ADD CONSTRAINT publicacion_usuario_fk FOREIGN KEY (usuariod_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


-- Completed on 2026-07-03 09:04:00

--
-- PostgreSQL database dump complete
--

