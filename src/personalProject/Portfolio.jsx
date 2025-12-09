import React, { useState, useEffect } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", message: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const boxes = document.querySelectorAll('.box');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('show');
            }, 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    boxes.forEach(box => observer.observe(box));
    return () => boxes.forEach(box => observer.unobserve(box));
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const validatePhone = (value) => {
    let phoneError = "";
    if (!value) {
      phoneError = "Phone number is required";
    } else if (!/^[0-9]*$/.test(value)) {
      phoneError = "Only numbers are allowed";
    } else if (value.length !== 10 && value.length > 0) {
      phoneError = "Number must be exactly 10 digits";
    }
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    let nameError = "";
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      nameError = "Only letters and spaces are allowed";
    } else if (!value.trim()) {
      nameError = "Please enter your name";
    } else if (value.trim().length < 2) {
      nameError = "Name must be at least 2 characters";
    }

    setErrors((prev) => ({ ...prev, name: nameError }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    let emailError = "";
    if (!value) {
      emailError = "Email cannot be empty";
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      emailError = "Please enter a valid email address";
    }

    setErrors((prev) => ({ ...prev, email: emailError }));
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      if (value.length <= 10) {
        setNumber(value);
        validatePhone(value);
      }
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    let msgError = "";
    const trimmed = value.trim();
    if (!trimmed) {
      msgError = "Message cannot be empty";
    } else if (trimmed.length > 1500) {
      msgError = `Message exceeds limit (${trimmed.length}/1500)`;
    }

    setErrors((prev) => ({ ...prev, message: msgError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsSubmitting(true);

    const newErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 letters";
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      newErrors.name = "Only letters and spaces are allowed";
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!number || number.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!message.trim()) {
      newErrors.message = "Message cannot be empty";
    } else if (message.trim().length > 1500) {
      newErrors.message = "Message must not exceed 1500 characters";
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((err) => !err);
    if (isValid) {
      const formData = {
        name: name.trim(),
        email: email.trim(),
        phone: number,
        message: message.trim()
      };

      try {
        // Update this URL to match your backend server
        const response = await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSubmitStatus("success");
          setName("");
          setEmail("");
          setNumber("");
          setMessage("");
          setErrors({ name: "", email: "", phone: "", message: "" });
          
          setTimeout(() => setSubmitStatus(null), 5000);
        } else {
          setSubmitStatus("error");
          
          // Handle duplicate email error
          if (result.message && result.message.includes('email has already submitted')) {
            setErrors(prev => ({ ...prev, email: "This email has already been submitted" }));
          }
          
          // Handle validation errors from backend
          if (result.errors && Array.isArray(result.errors)) {
            console.error("Validation errors:", result.errors);
          }
          
          console.error("Backend Error:", result);
        }
      } catch (error) {
        console.error("Network error:", error);
        setSubmitStatus("error");
      }
    }
    
    setIsSubmitting(false);
  };

  const services = [
    {
      icon: "https://img.icons8.com/?size=100&id=tyipuNqChncx&format=png&color=1A1A1A",
      title: "Responsive Websites",
      desc: "Creating mobile-friendly and cross-device compatible websites."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=9FIsA0EBzR3E&format=png&color=1A1A1A",
      title: "Front-end Development",
      desc: "Building interactive and functional web pages using HTML, CSS, and JavaScript."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=hsPbhkOH4FMe&format=png&color=000000",
      title: "Backend Development",
      desc: "Building robust server-side applications with Node.js and Express for seamless data handling."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=87836&format=png&color=1A1A1A",
      title: "Portfolio & Personal Website Creation",
      desc: "Designing and developing portfolios or personal websites for individuals."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=ttYNbQ91hKq9&format=png&color=000000",
      title: "Bug Fixing",
      desc: "Debugging and fixing issues across the full stack - HTML, CSS, JavaScript, and backend."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=53450&format=png&color=000000",
      title: "Website Redesign",
      desc: "Updating an old website with a fresh, modern look."
    }
  ];

  const projects = [
    {
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
      title: "Online Bus Ticket Booking"
    },
    {
      img: "https://media.istockphoto.com/id/2157380241/photo/nurse-making-the-bed-at-a-hospital.jpg?s=612x612&w=0&k=20&c=B32wSEqMmPGFbQjcI_SdnhHvqXEVQUpKTQUnhAiHGro=",
      title: "Hospital Bed Management"
    },
    {
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      title: "Personal Portfolio Website"
    }
  ];

  const skills = [
    {
      icon: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000",
      name: "HTML",
      desc: "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000",
      name: "CSS",
      desc: "CSS (Cascading Style Sheets) is used to style and design web pages. It controls how HTML elements look."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=106036&format=png&color=000000",
      name: "JavaScript",
      desc: "JavaScript is a programming language used to make web pages interactive and dynamic."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=123603&format=png&color=000000",
      name: "React",
      desc: "React is a JavaScript library for building user interfaces with reusable components and efficient rendering."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=hsPbhkOH4FMe&format=png&color=000000",
      name: "Node.js",
      desc: "Node.js is a JavaScript runtime for building fast, scalable server-side applications and APIs."
    },
    {
      icon: "https://img.icons8.com/?size=100&id=74402&format=png&color=000000",
      name: "MongoDB",
      desc: "MongoDB is a NoSQL database for storing and managing data in flexible, JSON-like documents."
    }
  ];

  return (
    <div className={`portfolio ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Navigation */}
      <nav className="portfolio-nav">
        <div className="nav-content">
          <div className="logo">
            <img
              src="https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=000000"
              alt="Logo"
              className="logo-img"
            />
            <span className="logo-text">Myfolio</span>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="nav-links">
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('services')}>Services</button>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
            <button onClick={() => scrollToSection('aboutme')}>About Me</button>
          </div>

          <div className="nav-right">
            {/* Theme Toggle Switch */}
            <div className="theme-toggle" onClick={toggleTheme}>
              <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                  <span className="toggle-icon">{isDarkMode ? '🌙' : '☀️'}</span>
                </div>
              </div>
            </div>

            <button onClick={() => scrollToSection('contact')} className="contact-nav-btn">
              Contact Me
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('services')}>Services</button>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
            <button onClick={() => scrollToSection('aboutme')}>About Me</button>
            <button onClick={() => scrollToSection('contact')}>Contact Me</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section box">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient box">Web developer</span>
              <br />
              <span className="box">crafting products</span>
              <br />
              <span className="box">that people love</span>
            </h1>
            <p className="hero-description box">
              I'm Vignesh — a full-stack developer who creates clean, responsive, and
              engaging websites. I love turning ideas into interactive digital experiences.
            </p>
          </div>
          <div className="hero-image-container box">
            <img
              src="viki.jpg"
              alt="Profile"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Services Section */}
      <section id="services" className="services-section box">
        <h2 className="section-title">
          Look at my <span className="gradient">services</span>
        </h2>
        <p className="section-subtitle">
          If you are looking for someone who will help you to build your
          <br />
          digital web presence than congratulations!
        </p>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card box">
              <img src={service.icon} alt={service.title} className="service-icon" />
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Projects Section */}
      <section id="projects" className="projects-section box">
        <h2 className="section-title">
          <span className="gradient">Projects</span> I have done
        </h2>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card box">
              <img src={project.img} alt={project.title} className="project-image" />
              <div className="project-tags">
                <span className="tag">Design</span>
                <span className="tag">Development</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Skills Section */}
      <section className="skills-section box">
        <h2 className="section-title">
          <span className="gradient">Skills</span>
        </h2>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card box">
              <img src={skill.icon} alt={skill.name} className="skill-icon" />
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-desc">{skill.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="aboutme" className="about-section box">
        <h2 className="about-title box">Vignesh</h2>
        <p className="about-text box">
          Hi, I'm Vignesh — a passionate and motivated web developer who recently
          graduated and is excited to kickstart my career in tech. I specialize in
          building responsive and user-friendly websites using HTML, CSS, JavaScript,
          React, Node.js, and MongoDB. I enjoy turning ideas into functional web 
          experiences and continuously improving my skills through hands-on projects.
        </p>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="contact-section">
        <div className="form-container box">
          <div className="contact-form">
            <h2 className="form-title">
              Let's Create <span className="gradient">Something Great</span>
            </h2>
            <p className="form-subtitle">I'm excited to hear about your project. Fill out the form below and let's get in touch.</p>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="input-wrapper">
                <div className="input-group">
                  <img
                    src="https://img.icons8.com/?size=100&id=NjOjDSZRU0Ma&format=png&color=FFFFFF"
                    alt="Name icon"
                    className="input-icon"
                  />
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Vignesh)"
                    value={name}
                    onChange={handleNameChange}
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    required
                  />
                </div>
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              {/* Email Field */}
              <div className="input-wrapper">
                <div className="input-group">
                  <img
                    src="https://img.icons8.com/?size=100&id=pBIeObS8d0aU&format=png&color=FFFFFF"
                    alt="Email icon"
                    className="input-icon"
                  />
                  <input
                    type="email"
                    placeholder="Your Email (e.g., user@example.com)"
                    value={email}
                    onChange={handleEmailChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    required
                  />
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* Phone Field */}
              <div className="input-wrapper">
                <div className="input-group">
                  <img
                    src="https://img.icons8.com/?size=100&id=jShwZ2RCyPSO&format=png&color=FFFFFF"
                    alt="Phone icon"
                    className="input-icon"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone Number (10 digits)"
                    value={number}
                    onChange={handleNumberChange}
                    maxLength="10"
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    required
                  />
                </div>
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>

              {/* Message Field */}
              <div className="input-wrapper">
                <div className="input-group textarea-group">
                  <img
                    src="https://img.icons8.com/?size=100&id=oTLoSObutcvn&format=png&color=FFFFFF"
                    alt="Message icon"
                    className="input-icon textarea-icon"
                  />
                  <textarea
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={handleMessageChange}
                    maxLength="1500"
                    className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                    rows="6"
                    required
                  />
                </div>
                <div className="textarea-footer">
                  <div className="char-count">{message.length}/1500</div>
                  {errors.message && <div className="error-message">{errors.message}</div>}
                </div>
              </div>

              {/* Submission Feedback */}
              {submitStatus === 'success' && (
                <div className="submission-message success">
                  ✅ Message sent successfully! I'll be in touch soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="submission-message error">
                  ❌ Submission failed. Please check your connection and try again.
                </div>
              )}

              {/* Submit Button */}
              <div className="submit-wrapper">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;