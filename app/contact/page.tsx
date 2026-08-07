"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { submitContactForm } from "../lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContactForm(formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Contact <span className="text-transparent bg-clip-text african-gradient">Us</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We'd love to hear from you. Please reach out to us at our emails below or send us a message.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-sm md:text-base font-medium">
              <a href="mailto:sunday@letusecho.com" className="text-primary hover:underline">sunday@letusecho.com</a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a href="mailto:sunnexajayi@gmail.com" className="text-primary hover:underline">sunnexajayi@gmail.com</a>
            </div>
          </div>

          <div className="mt-10 bg-card border border-border rounded-xl shadow-sm p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              {status === "success" && (
                <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-sm">
                  Your message has been sent successfully!
                </div>
              )}
              {status === "error" && (
                <div className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white african-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
