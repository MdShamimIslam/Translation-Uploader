import { useState, useRef, useEffect } from "react"
import { categories } from "../utils/options"
const Category = ({selectedCategory, setSelectedCategory}) => {
  const sliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)

  const totalPages = Math.ceil(categories.length / 5)

  useEffect(() => {
    const updatePageWidth = () => {
      if (sliderRef.current) {
        const cardElements = sliderRef.current.querySelectorAll(".category-card")
        if (cardElements.length > 0) {
          const cardWidth = cardElements[0].offsetWidth
          const gap = 15 
          const calculatedPageWidth = 5 * cardWidth + 4 * gap
          setPageWidth(calculatedPageWidth)
        }
      }
    }
    updatePageWidth()
    window.addEventListener("resize", updatePageWidth)
    const handleScroll = () => {
      if (sliderRef.current && pageWidth > 0) {
        const scrollPosition = sliderRef.current.scrollLeft
        const currentPage = Math.round(scrollPosition / pageWidth)
        setActivePage(currentPage)
      }
    }
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", handleScroll)
    }
    return () => {
      window.removeEventListener("resize", updatePageWidth)
      if (slider) {
        slider.removeEventListener("scroll", handleScroll)
      }
    }
  }, [pageWidth])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - sliderRef.current.offsetLeft)
    setScrollLeftPos(sliderRef.current.scrollLeft)
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grabbing"
      sliderRef.current.style.userSelect = "none"
    }
  }
  const handleMouseUp = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab"
      sliderRef.current.style.userSelect = ""
      if (pageWidth > 0) {
        const scrollPosition = sliderRef.current.scrollLeft
        const nearestPage = Math.round(scrollPosition / pageWidth)
        sliderRef.current.scrollTo({
          left: nearestPage * pageWidth,
          behavior: "smooth",
        })
      }
    }
  }
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }
  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX) * 1.5 ;
    sliderRef.current.scrollLeft = scrollLeftPos - walk
  }
  const handleCategoryClick = (id) => {
    const pageIndex = Math.floor(id / 5)
    setSelectedCategory(categories[id]);
    scrollToPage(pageIndex)
  }
  const scrollToPage = (pageIndex) => {
    if (sliderRef.current && pageWidth > 0) {
      sliderRef.current.scrollTo({
        left: pageIndex * pageWidth,
        behavior: "smooth",
      })
    }
  }
  const scrollLeft = () => {
    if (sliderRef.current && pageWidth > 0) {
      const newPage = Math.max(0, activePage - 1)
      scrollToPage(newPage)
    }
  }
  const scrollRight = () => {
    if (sliderRef.current && pageWidth > 0) {
      const newPage = Math.min(totalPages - 1, activePage + 1)
      scrollToPage(newPage)
    }
  }
  return (
    <div className="slider-container">
      <div className="step-indicator">
        <div className="step-number">3</div>
        <div className="step-text">Select the Category of your Text</div>
        <span className="step-text">Select the Category of your Text</span>
      </div>
      <div className="slider-wrapper">
        <button className="nav-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="slider-viewport">
          <div
            className={`slider-track ${isDragging ? "dragging" : ""}`}
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {categories.map((category) => (
              <div
                id={`category-${category.id}`}
                key={category.id}
                className={`category-card ${selectedCategory?.id === category.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="nav-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
      <div className="pagination-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`dot ${activePage === index ? "active" : ""}`}
            onClick={() => scrollToPage(index)}
          />
        ))}
      </div>
    </div>
  )
}
export default Category