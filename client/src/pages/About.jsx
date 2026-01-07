import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>Sobre Nosotros</h1>
        <p>
          Somos una biblioteca moderna comprometida con democratizar el acceso al conocimiento
          y fomentar el amor por la lectura en nuestra comunidad.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <div className="about-content">
        <div className="about-card">
          <div className="about-card-icon">🎯</div>
          <h2>Nuestra Misión</h2>
          <p>
            Proporcionar acceso equitativo a recursos educativos y culturales de calidad,
            promoviendo el aprendizaje continuo y el desarrollo intelectual de todos los
            miembros de nuestra comunidad.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">🌟</div>
          <h2>Nuestra Visión</h2>
          <p>
            Ser un referente en innovación bibliotecaria, creando espacios inclusivos donde
            la tecnología y la tradición se encuentran para inspirar, educar y transformar vidas
            a través del poder de los libros.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">💡</div>
          <h2>Nuestra Historia</h2>
          <p>
            Desde nuestros inicios, hemos evolucionado constantemente para adaptarnos a las
            necesidades de nuestros usuarios, combinando la calidez del servicio tradicional
            con las ventajas de la tecnología moderna.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <section className="about-values">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-item-icon">📚</div>
            <h3>Excelencia</h3>
            <p>Comprometidos con la calidad en cada servicio que ofrecemos</p>
          </div>

          <div className="value-item">
            <div className="value-item-icon">🤝</div>
            <h3>Inclusión</h3>
            <p>Un espacio abierto y acogedor para toda la comunidad</p>
          </div>

          <div className="value-item">
            <div className="value-item-icon">🚀</div>
            <h3>Innovación</h3>
            <p>Adoptando nuevas tecnologías para mejorar la experiencia</p>
          </div>

          <div className="value-item">
            <div className="value-item-icon">🌱</div>
            <h3>Sostenibilidad</h3>
            <p>Cuidando nuestros recursos para las futuras generaciones</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>¿Listo para explorar?</h2>
        <p>Descubre nuestra colección y comienza tu viaje literario hoy mismo</p>
        <a href="/libros" className="cta-button">
          Ver Catálogo
        </a>
      </section>
    </div>
  );
}
