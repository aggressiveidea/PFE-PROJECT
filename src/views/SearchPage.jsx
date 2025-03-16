"use client"
import { ThemeProvider } from "next-themes"
import Hero from "../components/forProfile/Hero"
import SearchBar from "../components/forProfile/SearchBar"
import ResearchSection from "../components/forProfile/ResearchSection"
import ArticlesSection from "../components/forProfile/ArticlesSection"
import "./SearchPage.css"

export default function SearchPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="app">
        <main>
          <Hero />
          <div className="content">
            <SearchBar />
            <ResearchSection />
            <ArticlesSection />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

