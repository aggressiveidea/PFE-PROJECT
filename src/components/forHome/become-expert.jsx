"use client"

import { useState } from "react"
import { Mail, Send, CheckCircle } from "lucide-react"
import "./become-expert.css"
import { submitExpertApplication } from "../../services/Api" 

const BecomeExpert = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await submitExpertApplication(formData)

      if (response.success) {
        setIsSubmitted(true)
      } else {
        setError(response.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="become-expert" className="become-expert">
      <div className="container">
        <div className="section-header">
          <div className="badge">Join Us</div>
          <h2>Become an ICT Expert</h2>
          <p>
            Share your knowledge and help us expand our multilingual ICT dictionary. Apply to join our team of experts.
          </p>
        </div>

        <div className="expert-container">
          <div className="expert-info">
            <div className="info-card">
              <div className="info-icon">
                <CheckCircle size={24} />
              </div>
              <div className="info-content">
                <h3>Share Your Knowledge</h3>
                <p>Contribute to our growing database of ICT terms and help others understand complex terminology.</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <CheckCircle size={24} />
              </div>
              <div className="info-content">
                <h3>Multilingual Contributions</h3>
                <p>
                  Help translate and define ICT terms in English, French, and Arabic to make knowledge accessible to
                  more people.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <CheckCircle size={24} />
              </div>
              <div className="info-content">
                <h3>Join Our Community</h3>
                <p>
                  Connect with other ICT professionals and be part of a growing community dedicated to knowledge
                  sharing.
                </p>
              </div>
            </div>
          </div>

          <div className="expert-form">
            {isSubmitted ? (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle size={32} />
                </div>
                <h3>Application Received!</h3>
                <p>
                  Thank you for your interest in becoming an ICT expert. Our team will review your application and
                  contact you soon.
                </p>
                <button className="reset-button" onClick={() => setIsSubmitted(false)}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <div className="form-icon">
                    <Mail size={24} />
                  </div>
                  <h3>Contact Administrators</h3>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && <div className="error-message">{error}</div>}

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name*</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="expertise">Area of ICT Expertise*</label>
                    <select id="expertise" name="expertise" value={formData.expertise} onChange={handleChange} required>
                      <option value="">Select an area</option>
                      <option value="ai">Artificial Intelligence</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="security">Cybersecurity</option>
                      <option value="networking">Networking</option>
                      <option value="hardware">Hardware</option>
                      <option value="software">Software Development</option>
                      <option value="database">Database Systems</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Why do you want to join our team?*</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BecomeExpert


