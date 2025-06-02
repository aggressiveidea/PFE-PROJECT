import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, CheckCircle, Users, Globe, BookOpen, Lock, UserPlus } from "lucide-react"
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
  const [showSignUpRequired, setShowSignUpRequired] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserStatus = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const authData = JSON.parse(localStorage.getItem("authData") || "{}")

        console.log("BecomeExpert - User Status Check:")
        console.log("- Stored user:", storedUser)
        console.log("- Auth data:", authData)
        console.log("- Has email:", !!storedUser.email)
        console.log("- Has token:", !!authData.token)
        console.log("- Is verified:", storedUser.isVerified || false)

        if (storedUser && storedUser.email) {
          const userStatus = {
            ...storedUser,
            isSignedIn: true,
            isVerified: storedUser.isVerified || false,
            hasToken: !!authData.token,
          }

          console.log("BecomeExpert - Final user status:", userStatus)
          setUser(userStatus)
        } else {
          const guestStatus = {
            isSignedIn: false,
            isVerified: false,
            hasToken: false,
          }

          console.log("BecomeExpert - Guest status:", guestStatus)
          setUser(guestStatus)
        }
      } catch (error) {
        console.error("BecomeExpert - Error checking user status:", error)
        setUser({
          isSignedIn: false,
          isVerified: false,
          hasToken: false,
        })
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()

    const handleUserUpdate = () => {
      console.log("BecomeExpert - User updated event received, rechecking status...")
      checkUserStatus()
    }

    window.addEventListener("userUpdated", handleUserUpdate)
    window.addEventListener("storage", checkUserStatus)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
      window.removeEventListener("storage", checkUserStatus)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    console.log(`BecomeExpert - Form field updated: ${name} = ${value}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("BecomeExpert - Form submission attempted")
    console.log("- User status:", {
      isSignedIn: user?.isSignedIn,
      isVerified: user?.isVerified,
      hasToken: user?.hasToken,
    })
    console.log("- Form data:", formData)

    if (!user || !user.isSignedIn || !user.isVerified) {
      console.log("BecomeExpert - Access denied, showing sign-up required")
      setShowSignUpRequired(true)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("BecomeExpert - Submitting application to API...")
      const response = await submitExpertApplication(formData)
      console.log("BecomeExpert - API response:", response)

      if (response.success) {
        console.log("BecomeExpert - Application submitted successfully")
        setIsSubmitted(true)
      } else {
        console.error("BecomeExpert - Application submission failed:", response.message)
        setError(response.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("BecomeExpert - Error submitting application:", error)
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignUp = () => {
    console.log("BecomeExpert - Redirecting to sign up page")
    window.location.href = "/signup"
  }

  const handleSignIn = () => {
    console.log("BecomeExpert - Redirecting to sign in page")
    window.location.href = "/login"
  }

  const resetForm = () => {
    console.log("BecomeExpert - Resetting form")
    setIsSubmitted(false)
    setShowSignUpRequired(false)
    setFormData({
      name: "",
      email: "",
      expertise: "",
      message: "",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (loading) {
    console.log("BecomeExpert - Rendering loading state")
    return (
      <section id="become-expert" className="expert-become-expert">
        <div className="expert-container">
          <div className="expert-loading-container">
            <div className="expert-loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  console.log("BecomeExpert - Rendering main component")

  return (
    <section id="become-expert" className="expert-become-expert">
      <div className="expert-container">
        <motion.div
          className="expert-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="expert-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Users size={16} />
            <span>Join Us</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Become an ICT Expert
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Share your knowledge and help us expand our multilingual ICT dictionary. Apply to join our team of experts.
          </motion.p>
        </motion.div>

        <div className="expert-expert-container">
          <motion.div className="expert-expert-info" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="expert-info-card" variants={cardVariants} whileHover={{ y: -4 }}>
              <div className="expert-info-icon">
                <BookOpen size={24} />
              </div>
              <div className="expert-info-content">
                <h3>Share Your Knowledge</h3>
                <p>Contribute to our growing database of ICT terms and help others understand complex terminology.</p>
              </div>
            </motion.div>

            <motion.div className="expert-info-card" variants={cardVariants} whileHover={{ y: -4 }}>
              <div className="expert-info-icon">
                <Globe size={24} />
              </div>
              <div className="expert-info-content">
                <h3>Multilingual Contributions</h3>
                <p>
                  Help translate and define ICT terms in English, French, and Arabic to make knowledge accessible to
                  more people.
                </p>
              </div>
            </motion.div>

            <motion.div className="expert-info-card" variants={cardVariants} whileHover={{ y: -4 }}>
              <div className="expert-info-icon">
                <Users size={24} />
              </div>
              <div className="expert-info-content">
                <h3>Join Our Community</h3>
                <p>
                  Connect with other ICT professionals and be part of a growing community dedicated to knowledge
                  sharing.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="expert-expert-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {showSignUpRequired ? (
                <motion.div
                  className="expert-signup-required"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="expert-signup-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  >
                    <Lock size={32} />
                  </motion.div>
                  <h3>
                    {!user?.isSignedIn
                      ? "Sign Up Required"
                      : !user?.isVerified
                        ? "Email Verification Required"
                        : "Access Restricted"}
                  </h3>
                  <p>
                    {!user?.isSignedIn
                      ? "To unlock this feature and submit your expert application, you need to sign up for an account and verify your email address."
                      : !user?.isVerified
                        ? "Please verify your email address to submit your expert application. Check your inbox for a verification email."
                        : "You need to complete your account setup to access this feature."}
                  </p>
                  <div className="expert-signup-actions">
                    {!user?.isSignedIn ? (
                      <>
                        <motion.button
                          className="expert-signup-button"
                          onClick={handleSignUp}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <UserPlus size={16} />
                          Sign Up Now
                        </motion.button>
                        <motion.button
                          className="expert-signin-button"
                          onClick={handleSignIn}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Already have an account? Sign In
                        </motion.button>
                      </>
                    ) : !user?.isVerified ? (
                      <motion.button
                        className="expert-signup-button"
                        onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Mail size={16} />
                        Refresh After Verification
                      </motion.button>
                    ) : (
                      <motion.button
                        className="expert-signin-button"
                        onClick={handleSignIn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In to Continue
                      </motion.button>
                    )}
                  </div>
                  <motion.button
                    className="expert-back-button"
                    onClick={() => setShowSignUpRequired(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Form
                  </motion.button>
                </motion.div>
              ) : isSubmitted ? (
                <motion.div
                  className="expert-success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="expert-success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  >
                    <CheckCircle size={32} />
                  </motion.div>
                  <h3>Application Received!</h3>
                  <p>
                    Thank you for your interest in becoming an ICT expert. Our team will review your application and
                    contact you soon.
                  </p>
                  <motion.button
                    className="expert-reset-button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Another Application
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="expert-form-header">
                    <div className="expert-form-icon">
                      <Mail size={24} />
                    </div>
                    <h3>Contact Administrators</h3>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="expert-error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="expert-form-row">
                      <motion.div
                        className="expert-form-group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                      >
                        <label htmlFor="name">Full Name*</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>

                      <motion.div
                        className="expert-form-group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <label htmlFor="email">Email Address*</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="expert-form-group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <label htmlFor="expertise">Area of ICT Expertise*</label>
                      <select
                        id="expertise"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        required
                      >
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
                    </motion.div>

                    <motion.div
                      className="expert-form-group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label htmlFor="message">Why do you want to join our team?*</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="expert-submit-button"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="expert-spinner"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application <Send size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BecomeExpert
