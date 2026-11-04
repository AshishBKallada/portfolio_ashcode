"use client"

import React, { useEffect, useRef } from "react"
import { Expo, gsap, Power1, Quint } from "gsap"

interface ImageTrailProps {
    images: string[]
    imageWidth?: number
    imageHeight?: number
    threshold?: number
    duration?: number
    /** The first time the area scrolls into view, sweep a pointer across it once to show what moving does. */
    intro?: boolean
}

/** The intro sweep: how long it runs, and its path across the area (0–1 of width and height). */
const INTRO_S = 1.8
const introPath = (t: number) => ({ x: 0.14 + 0.72 * t, y: 0.5 + 0.2 * Math.sin(t * Math.PI * 2) })

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

export function ImageTrail({
    images = [],
    imageWidth = 200,
    imageHeight = 200,
    threshold = 50,
    duration = 1.6,
    intro = false,
}: ImageTrailProps) {
    const contentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const content = contentRef.current
        if (!content) return
        const imgs = Array.from(content.querySelectorAll("img"))
        // Still for reduced motion.
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (imgs.length === 0 || reduce) return

        const mousePos = { x: 0, y: 0 }
        const cacheMousePos = { x: 0, y: 0 }
        let lastMousePos = { x: 0, y: 0 }
        let zIndexVal = 1
        let imgPosition = 0
        let parentSize = { width: 0, height: 0 }
        let frame = 0
        // The loop runs only while the area is on screen.
        let running = false
        // The intro sweep's start time while it runs; a real pointer over the area cuts it short.
        let introStart: number | null = null

        const calcParentSize = () => {
            const rect = content.getBoundingClientRect()
            parentSize = { width: rect.width, height: rect.height }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = content.getBoundingClientRect()
            // Only trail while the pointer is over the area, not anywhere on the page.
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            if (inside) {
                introStart = null
                mousePos.x = e.clientX - rect.left
                mousePos.y = e.clientY - rect.top
            }
        }

        const showNextImage = () => {
            const img = imgs[imgPosition]
            if (!img) return

            const rect = img.getBoundingClientRect()
            gsap.killTweensOf(img)

            gsap
                .timeline()
                .set(img, {
                    startAt: { opacity: 0 },
                    opacity: 1,
                    zIndex: zIndexVal,
                    x: cacheMousePos.x - rect.width / 2,
                    y: cacheMousePos.y - rect.height / 2,
                })
                .to(img, {
                    duration: duration,
                    ease: Expo.easeOut,
                    x: mousePos.x - rect.width / 2,
                    y: mousePos.y - rect.height / 2,
                })
                .to(
                    img,
                    {
                        duration: 1,
                        ease: Power1.easeOut,
                        opacity: 0,
                    },
                    duration - 1 > 0 ? duration - 1 : 0.4
                )
                .to(
                    img,
                    {
                        duration: 1,
                        ease: Quint.easeInOut,
                        y: `+=${parentSize.height + rect.height / 2}`,
                    },
                    duration - 1 > 0 ? duration - 1 : 0.4
                )
        }

        const renderImages = (now: number) => {
            if (introStart !== null) {
                const t = Math.min(1, (now - introStart) / (INTRO_S * 1000))
                const at = introPath(t)
                mousePos.x = at.x * parentSize.width
                mousePos.y = at.y * parentSize.height
                if (t >= 1) introStart = null
            }

            const distance = Math.hypot(mousePos.x - lastMousePos.x, mousePos.y - lastMousePos.y)

            cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1)
            cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1)

            if (distance > threshold) {
                showNextImage()
                zIndexVal += 1
                imgPosition = (imgPosition + 1) % imgs.length
                lastMousePos = { ...mousePos }
            }

            if (running) frame = requestAnimationFrame(renderImages)
        }

        const visibility = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) {
                running = true
                frame = requestAnimationFrame(renderImages)
            } else if (!entry.isIntersecting && running) {
                running = false
                cancelAnimationFrame(frame)
            }
        })

        calcParentSize()

        // Once, as the area comes into view: start the sweep from its first point.
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                calcParentSize()
                const start = introPath(0)
                mousePos.x = lastMousePos.x = cacheMousePos.x = start.x * parentSize.width
                mousePos.y = lastMousePos.y = cacheMousePos.y = start.y * parentSize.height
                introStart = performance.now()
            },
            { threshold: 0.6 }
        )
        if (intro) io.observe(content)

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("resize", calcParentSize)
        visibility.observe(content)

        return () => {
            running = false
            cancelAnimationFrame(frame)
            visibility.disconnect()
            io.disconnect()
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("resize", calcParentSize)
            gsap.killTweensOf(imgs)
        }
    }, [threshold, duration, intro])

    return (
        <div
            style={
                {
                    "--image-width": `${imageWidth}px`,
                    "--image-height": `${imageHeight}px`,
                } as React.CSSProperties
            }
            className="relative isolate z-0 flex h-full w-full items-center justify-center overflow-hidden"
            ref={contentRef}
            aria-hidden
        >
            {images.map((url, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={index}
                    className="pointer-events-none absolute top-0 left-0 h-[var(--image-height)] w-[var(--image-width)] object-cover opacity-0 will-change-transform"
                    src={url}
                    alt=""
                />
            ))}
        </div>
    )
}
