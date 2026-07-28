"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;700;800&family=Permanent+Marker&display=swap');
:root {
  /* LIGHT MODE (Classic Comic) */
  --cream: #fffdf5;
  --ink: #1a1a2e;
  --yellow: #ffd60a;
  --coral: #ff6b6b;
  --teal: #4ecdc4;
  --halftone: radial-gradient(circle, rgba(26,26,46,0.1) 1px, transparent 0);
  --panel-bg: #fffdf5;
  --text-muted: #444;
}

[data-theme="dark"] {
  /* DARK MODE (Neon Noir) */
  --cream: #0b0e14;
  --ink: #ffffff;
  --yellow: #7c3aed;
  --coral: #00f2ff;
  --teal: #ff007a;
  --halftone: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 0);
  --panel-bg: rgba(255,255,255,0.03);
  --text-muted: #bbb;
}

:root {
  --halftone-size: 15px 15px;
  --panel-shadow: 4px 4px 0 var(--yellow);
  --panel-shadow-lg: 8px 8px 0 var(--yellow);
  --cb-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  --cb-pop: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --cb-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --cb-shiver: linear;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  min-height: 100vh;
  background-image: var(--halftone);
  background-size: 20px 20px;
  font-family: 'Nunito', sans-serif;
  cursor: none;
  color: var(--ink);
}
::selection { background: var(--yellow); color: var(--ink); }

/* NAVBAR */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: var(--cream);
  border-bottom: 2.5px solid var(--ink);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 70px;
  transition: height 0.3s var(--cb-smooth), padding 0.3s var(--cb-smooth), box-shadow 0.3s;
}
.navbar.scrolled {
  height: 54px; padding: 0 30px;
  box-shadow: 0 4px 0 rgba(26,26,46,0.05);
}
.navbar-logo {
  font-family: 'Bangers', cursive; font-size: 28px;
  color: var(--ink); letter-spacing: 2px; text-decoration: none;
  transition: transform 0.2s var(--cb-pop);
}
.navbar-logo:hover { transform: scale(1.05) rotate(-2deg); }
.navbar-links { display: flex; gap: 8px; align-items: center; }
.nav-link {
  font-family: 'Bangers', cursive; font-size: 16px;
  letter-spacing: 1px; color: var(--ink);
  padding: 4px 12px; border: 2.5px solid transparent;
  cursor: none; text-decoration: none; transition: all 0.2s var(--cb-pop);
  border-radius: 3px; position: relative;
}
.theme-toggle {
  background: var(--yellow); border: 2.5px solid var(--ink);
  padding: 0; border-radius: 50%; cursor: none;
  width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
  font-size: 18px; margin-left: 10px; transition: all 0.3s var(--cb-pop);
  box-shadow: 3px 3px 0 var(--ink);
  overflow: hidden; position: relative;
}
.theme-toggle:hover { 
  transform: scale(1.1) rotate(15deg);
  box-shadow: 5px 5px 0 var(--ink);
}
.theme-icon-wrap {
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.5s var(--cb-pop);
}
.theme-toggle:active .theme-icon-wrap { transform: scale(0.8) rotate(-90deg); }
.nav-link:hover {
  animation: magnetic-pull 0.2s linear infinite;
  background: rgba(255,214,10,0.3);
}
.nav-link.active {
  background: var(--yellow); border-color: var(--ink);
  box-shadow: 3px 3px 0 var(--ink);
  transform: translate(-2px,-2px) rotate(-1deg);
}

/* CURSOR */
.custom-cursor {
  position: fixed; pointer-events: none; z-index: 99999;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--yellow); border: 2px solid var(--ink);
  mix-blend-mode: multiply;
  transition: width 0.15s, height 0.15s, background 0.15s;
  transform: translate(-50%,-50%);
}
.custom-cursor.hovered {
  width: 40px; height: 40px; background: var(--coral);
}

/* HERO */
#hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  padding: 0 10%; background: var(--cream);
  position: relative; overflow: hidden;
}
#hero::before {
  content: ""; position: absolute; inset: 0;
  background-image: var(--halftone); background-size: var(--halftone-size);
  opacity: 0.4; z-index: 1; pointer-events: none;
  animation: bg-drift 20s linear infinite;
}
@keyframes bg-drift {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}
.hero-content { position: relative; z-index: 10; max-width: 800px; }
.hero-pre {
  font-family: 'Bangers', cursive; color: var(--coral);
  font-size: 20px; letter-spacing: 2px; margin-bottom: 10px;
  display: block; animation: wipe-in 0.8s var(--cb-pop) forwards;
}
.hero-title {
  font-family: 'Bangers', cursive; font-size: clamp(60px, 12vw, 110px);
  line-height: 0.85; color: var(--ink); margin-bottom: 20px;
  text-transform: uppercase;
  -webkit-text-stroke: 1.5px var(--ink);
  paint-order: stroke fill;
  text-shadow: 6px 6px 0px rgba(0,0,0,0.1);
}
[data-theme="dark"] .hero-title {
  -webkit-text-stroke: 2px #000;
}
.hero-sub {
  font-family: 'Nunito', sans-serif; font-size: 20px;
  color: var(--ink); max-width: 550px; line-height: 1.6;
  margin-bottom: 35px;
  background: rgba(255,255,255,0.7); padding: 15px 25px;
  border: 4px solid var(--ink); border-radius: 8px;
  box-shadow: 6px 6px 0px var(--ink);
}
[data-theme="dark"] .hero-sub {
  background: rgba(0,0,0,0.5); color: white; border-color: white;
  box-shadow: 6px 6px 0px white;
}
.hero-actions { display: flex; gap: 20px; }
.hero-portrait {
  position: absolute; left: 50%; top: 33%;
  transform: translate(-50%, -50%) rotate(2deg);
  width: 400px; height: 400px;
  border: 6px solid var(--ink);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  box-shadow: 15px 15px 0 var(--yellow);
  z-index: 5; transition: all 0.4s var(--cb-pop);
  overflow: hidden;
}
.hero-portrait:hover {
  transform: translate(-50%, -50%) rotate(-1deg) scale(1.04);
  box-shadow: 20px 20px 0 var(--coral);
  outline-color: var(--coral);
}
.hero-portrait img { 
  width: 100%; height: 100%; object-fit: cover; 
}
.hero-symbols {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
}
.symbol { position: absolute; opacity: 0.15; font-family: 'Bangers', cursive; }
.symbol-1 { top: 15%; right: 10%; font-size: 80px; color: var(--coral); animation: float-manga 4s infinite; }
.symbol-2 { bottom: 20%; left: 5%; font-size: 60px; color: var(--teal); animation: float-manga 5s 0.5s infinite; }
.symbol-3 { top: 40%; right: 25%; font-size: 40px; color: var(--yellow); animation: float-manga 3.5s 1s infinite; }
.speed-lines {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 190px, rgba(26,26,46,0.05) 190px, rgba(26,26,46,0.05) 200px);
  animation: vertical-speed-drift 15s linear infinite;
  opacity: 0.4;
}
[data-theme="dark"] .speed-lines {
  background: repeating-linear-gradient(0deg, transparent, transparent 190px, rgba(255,255,255,0.03) 190px, rgba(255,255,255,0.03) 200px);
}
@keyframes vertical-speed-drift {
  from { transform: translateY(0); }
  to { transform: translateY(200px); }
}

/* SCROLL REVEAL */
.reveal {
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-left {
  opacity: 0; transform: translateX(-60px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right {
  opacity: 0; transform: translateX(60px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }

/* SECTIONS */
.section-title {
  font-family: 'Bangers', cursive; font-size: clamp(40px, 8vw, 70px);
  color: var(--ink); margin-bottom: 8px; text-transform: uppercase;
  position: relative; display: inline-block;
  opacity: 0; /* Hidden until visible */
}
.section-title.visible {
  opacity: 1;
  animation: heading-pop 0.6s var(--cb-pop) forwards;
}
.section-title::after {
  content: ""; position: absolute; bottom: 8px; left: 0; width: 100%; height: 12px;
  background: var(--yellow); z-index: -1; transform: skewX(-15deg);
  opacity: 0.6;
}
.section-subtitle {
  font-family: 'Permanent Marker', cursive; font-size: 20px;
  color: var(--coral); margin-bottom: 40px;
}

/* ABOUT */
#about {
  padding: 80px 60px; background: var(--cream);
}
.about-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 40px; margin-top: 48px; align-items: start;
}
@media(max-width:768px){
  .about-grid{grid-template-columns:1fr;}
  .navbar{padding:0 20px;}
}
.dossier-card {
  border: 2.5px solid var(--ink); background: var(--panel-bg);
  box-shadow: var(--panel-shadow-lg); border-radius: 4px;
  transform: rotate(-1deg); overflow: hidden; position: relative;
  backdrop-filter: blur(10px);
}
.dossier-header {
  background: var(--yellow); padding: 12px 20px;
  font-family: 'Bangers', cursive; font-size: 22px;
  letter-spacing: 2px; border-bottom: 2.5px solid var(--ink);
  color: var(--ink);
}
.dossier-body { padding: 20px; color: var(--ink); }
.dossier-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 0; border-bottom: 1.5px solid rgba(var(--ink-rgb, 128,128,128), 0.1);
  font-size: 14px; font-weight: 700;
}
.dossier-row:last-child { border-bottom: none; }
.dossier-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.dossier-label { color: var(--coral); min-width: 80px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.confidential-stamp {
  position: absolute; bottom: 16px; right: 16px;
  font-family: 'Bangers', cursive; font-size: 22px;
  color: #cc0000; border: 3px solid #cc0000;
  padding: 4px 10px; transform: rotate(15deg);
  opacity: 0.7; pointer-events: none; border-radius: 2px;
}
.comic-panel {
  background: var(--panel-bg); border: 2.5px solid var(--ink);
  padding: 24px; position: relative; border-radius: 4px;
  box-shadow: var(--panel-shadow); color: var(--ink);
  backdrop-filter: blur(5px);
}
.panel-num {
  font-family: 'Bangers', cursive; font-size: 20px;
  color: var(--coral); margin-bottom: 8px;
}

/* SKILLS */
#skills {
  padding: 80px 60px; background: var(--yellow);
  border-top: 2.5px solid var(--ink);
  border-bottom: 2.5px solid var(--ink);
}
.skills-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 32px 60px; margin-top: 48px;
}
@media(max-width:768px){.skills-grid{grid-template-columns:1fr;}}
.skill-cat-title {
  font-family: 'Bangers', cursive; font-size: 24px;
  color: var(--ink); margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.skill-cat-title::after {
  content: ''; flex: 1; height: 2px; background: var(--ink); opacity: 0.3;
}
.skill-row { margin-bottom: 18px; }
.skill-label-row {
  display: flex; justify-content: space-between;
  font-family: 'Nunito', sans-serif; font-weight: 700;
  font-size: 14px; margin-bottom: 6px;
}
.skill-track {
  height: 18px; background: #e8e0d0;
  border: 2px solid var(--ink); border-radius: 2px; overflow: hidden;
}
.skill-fill {
  height: 100%; background: var(--teal); border-radius: 20px;
  width: 0%; transition: width 1s var(--cb-pop);
  position: relative; overflow: hidden;
}
.skill-fill::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine-sweep 2s linear infinite;
}
.badge-cloud {
  display: flex; flex-wrap: wrap; gap: 10px;
  margin-top: 40px;
}
.badge {
  font-family: 'Nunito', sans-serif; font-weight: 800;
  font-size: 13px; padding: 5px 14px;
  border: 2.5px solid var(--ink); border-radius: 20px;
  box-shadow: 2px 2px 0 var(--ink);
}

/* PROJECTS */
#projects {
  padding: 80px 60px; background: var(--cream);
}
.projects-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 28px; margin-top: 48px;
}
@media(max-width:1024px){.projects-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:640px){.projects-grid{grid-template-columns:1fr;}}
.project-card {
  background: var(--panel-bg); border: 2.5px solid var(--ink);
  padding: 30px; border-radius: 4px;
  box-shadow: var(--panel-shadow);
  transition: all 0.4s var(--cb-elastic);
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
  cursor: none; backdrop-filter: blur(10px);
}
.project-card:hover {
  transform: translate(-8px, -8px) rotate(-0.5deg);
  box-shadow: 12px 12px 0 var(--yellow);
  border-color: var(--yellow);
}
.project-top {
  display: flex; justify-content: space-between; align-items: center;
}
.project-num {
  font-family: 'Bangers', cursive; font-size: 22px; color: var(--coral);
}
.status-badge {
  font-family: 'Bangers', cursive; font-size: 13px;
  padding: 2px 10px; border: 2px solid var(--ink);
  border-radius: 3px;
}
.project-title {
  font-family: 'Bangers', cursive; font-size: 22px;
  line-height: 1.2; color: var(--ink);
}
.project-desc {
  font-family: 'Inter', sans-serif; font-size: 15px;
  color: var(--text-muted); line-height: 1.5; margin-bottom: 20px;
  flex-grow: 1; position: relative; z-index: 2;
}
.project-metric {
  font-family: 'Permanent Marker', cursive; font-size: 14px;
  color: var(--coral); margin-bottom: 15px; position: relative; z-index: 2;
}
.project-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 25px; position: relative; z-index: 2; }
.project-tag {
  background: rgba(128,128,128, 0.1); font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 4px; color: var(--ink);
  border: 1px solid var(--ink);
}
.project-link {
  font-family: 'Bangers', cursive; font-size: 16px;
  padding: 8px 20px; border: 2.5px solid var(--ink);
  box-shadow: var(--panel-shadow); background: var(--cream);
  cursor: none; text-decoration: none; color: var(--ink);
  border-radius: 3px; display: inline-block;
  transition: all 0.15s; margin-top: auto;
}
.project-link:hover {
  background: var(--ink); color: var(--cream);
  transform: translate(-2px,-2px);
  box-shadow: 6px 6px 0 var(--yellow);
}

/* CONTACT */
#contact {
  padding: 100px 60px;
  background: var(--ink); color: var(--cream);
}
#contact .section-title { color: var(--yellow); }
#contact .section-title::after { background: var(--coral); border-color: var(--coral); }
.contact-icons { display: flex; gap: 20px; margin-top: 40px; justify-content: center; }
.contact-icon-btn {
  width: 54px; height: 54px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: var(--ink); color: var(--cream);
  transition: all 0.3s var(--cb-pop); border: 2.5px solid var(--ink);
  cursor: none;
}
.contact-icon-btn {
  background: var(--ink); color: var(--cream);
  width: 54px; height: 54px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 var(--yellow);
  transition: all 0.3s var(--cb-pop); cursor: none;
}
[data-theme="dark"] .contact-icon-btn {
  background: transparent; color: white; border-color: var(--yellow);
  box-shadow: 4px 4px 0 var(--teal);
}
.contact-icon-btn:hover {
  transform: scale(1.15) rotate(10deg);
  background: var(--yellow); color: var(--ink);
  box-shadow: 6px 6px 0 var(--coral);
}
.contact-form {
  max-width: 600px; margin: 48px auto 0;
  background: var(--panel-bg); 
  background-image: var(--halftone); background-size: 10px 10px;
  border: 4px solid var(--ink);
  padding: 40px; border-radius: 4px; position: relative;
  box-shadow: 15px 15px 0 var(--yellow); backdrop-filter: blur(10px);
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.form-group input, .form-group textarea, .form-input, .form-textarea {
  width: 100%; padding: 15px; border: 3px solid var(--ink);
  font-family: 'Nunito', sans-serif; font-size: 16px;
  background: var(--cream); color: var(--ink);
  border-radius: 4px;
  transition: all 0.2s;
}
[data-theme="dark"] .form-input, [data-theme="dark"] .form-textarea {
  background: #000; color: #fff; border-color: var(--coral);
  box-shadow: inset 0 0 10px rgba(0,242,255,0.1);
}
.form-input::placeholder, .form-textarea::placeholder {
  color: #1a1a2e; opacity: 0.5; font-weight: 700;
}
[data-theme="dark"] .form-input::placeholder, [data-theme="dark"] .form-textarea::placeholder {
  color: #fff; opacity: 0.8; font-weight: 700;
}
.form-input:focus, .form-textarea:focus {
  outline: none; border-color: var(--yellow);
  box-shadow: 4px 4px 0 var(--ink); transform: translate(-2px, -2px);
  background: white;
}
[data-theme="dark"] .form-input:focus, [data-theme="dark"] .form-textarea:focus {
  background: #111; border-color: var(--coral);
}
.form-textarea { resize: vertical; min-height: 150px; margin-top: 0; margin-bottom: 25px; }
.btn-send {
  font-family: 'Bangers', cursive; font-size: 24px;
  letter-spacing: 1px; padding: 14px 40px; width: 100%;
  background: var(--yellow); color: var(--ink);
  border: 3px solid var(--ink); border-radius: 4px;
  box-shadow: 6px 6px 0 var(--coral); cursor: none;
  transition: all 0.2s var(--cb-pop);
}
.btn-send:hover {
  transform: translate(-3px,-3px) scale(1.02);
  box-shadow: 9px 9px 0 var(--coral);
}
.footer-text {
  font-family: 'Permanent Marker', cursive;
  font-size: 15px; color: var(--cream);
  font-weight: bold;
  text-align: center; margin-top: 60px;
}
.dots-anim::after {
  content: ''; display: inline-block; width: 24px; text-align: left;
  animation: dots 2s steps(4,end) infinite;
}
@keyframes dots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
}

/* BUTTONS */
.btn {
  font-family: 'Bangers', cursive; font-size: 22px;
  padding: 12px 32px; cursor: none;
  border: 4px solid var(--ink); border-radius: 8px;
  transition: all 0.2s var(--cb-pop);
  box-shadow: 6px 6px 0px var(--ink);
  position: relative; overflow: hidden;
}
.btn:hover {
  transform: translate(-3px, -3px);
  box-shadow: 10px 10px 0px var(--ink);
}
.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--ink);
}
.btn:hover::after { opacity: 0.1; }
.btn:active {
  transform: translate(-1px,-1px);
  box-shadow: 2px 2px 0 var(--ink);
}
.btn-primary { background: var(--yellow); color: #1a1a2e; border-color: var(--ink); }
[data-theme="dark"] .btn-primary { color: white; }
.btn-outline { background: transparent; color: var(--ink); border-color: var(--ink); }
.btn-outline:hover { background: rgba(var(--ink-rgb, 255,255,255), 0.1); }

/* CHARACTER */
.character-wrap {
  position: fixed; right: 32px; bottom: 0;
  z-index: 900; pointer-events: none;
}
.speech-bubble {
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-20px);
  background: var(--cream); border: 3px solid var(--ink);
  padding: 10px 15px; border-radius: 15px;
  font-family: 'Bangers', cursive; font-size: 18px; color: var(--ink);
  box-shadow: 4px 4px 0 var(--ink); white-space: nowrap;
  animation: bubble-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  pointer-events: none;
  z-index: 10;
}
.speech-bubble::before {
  content: ''; position: absolute;
  bottom: -22px; left: 50%; transform: translateX(-50%);
  border: 11px solid transparent;
  border-top-color: var(--ink);
}
.speech-bubble::after {
  content: ''; position: absolute;
  bottom: -17px; left: 50%; transform: translateX(-50%);
  border-color: transparent;
  border-top-color: var(--cream);
}
[data-theme="dark"] .character-svg {
  filter: drop-shadow(1px 1px 0 white) drop-shadow(-1px -1px 0 white) drop-shadow(1px -1px 0 white) drop-shadow(-1px 1px 0 white);
}

/* PARTICLES */
.particle {
  position: absolute; pointer-events: none;
  border: 1.5px solid var(--ink);
}

/* KEYFRAMES */
@keyframes bob {
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-10px);}
}
@keyframes wave {
  0%,100%{transform:rotate(0deg);}
  25%{transform:rotate(-20deg);}
  75%{transform:rotate(20deg);}
}
@keyframes blink {
  0%,90%,100%{transform:scaleY(1);}
  95%{transform:scaleY(0.08);}
}
@keyframes excited-bounce {
  0%,100%{transform:translateY(0) rotate(0deg);}
  25%{transform:translateY(-14px) rotate(-2deg);}
  75%{transform:translateY(-8px) rotate(2deg);}
}
@keyframes nod {
  0%,100%{transform:translateY(0) rotate(0deg);}
  50%{transform:translateY(-4px) rotate(-1deg);}
}
@keyframes spin-slow { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
@keyframes float1 {
  0%,100%{transform:translateY(0) rotate(0deg);}
  50%{transform:translateY(-18px) rotate(10deg);}
}
@keyframes float2 {
  0%,100%{transform:translateY(0) rotate(5deg);}
  50%{transform:translateY(-22px) rotate(-8deg);}
}
@keyframes float3 {
  0%,100%{transform:translateY(-8px) rotate(-5deg);}
  50%{transform:translateY(8px) rotate(12deg);}
}
@keyframes ink-wipe {
  from{clip-path:inset(0 100% 0 0);}
  to{clip-path:inset(0 0% 0 0);}
}
@keyframes dots {
  0%{content:'';}33%{content:'.';}66%{content:'..';}100%{content:'...';}
}
@keyframes bubble-pop {
  from{transform:translateX(-50%) scale(0.5);opacity:0;}
  to{transform:translateX(-50%) scale(1);opacity:1;}
}
@keyframes wipe-in { from{clip-path:inset(0 100% 0 0);} to{clip-path:inset(0 0 0 0);} }
@keyframes shiver {
  0%, 100% { transform: translate(0,0); }
  25% { transform: translate(1px, -1px); }
  50% { transform: translate(-1px, 1.5px); }
  75% { transform: translate(-1px, -1px); }
}
@keyframes shine-sweep {
  0% { transform: translateX(-100%) skewX(-15deg); }
  50%, 100% { transform: translateX(200%) skewX(-15deg); }
}
@keyframes pulse-energy {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.3); }
}
@keyframes float-manga {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  33% { transform: translate(5px, -10px) rotate(2deg); }
  66% { transform: translate(-5px, -5px) rotate(-2deg); }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
@keyframes speed-line {
  0% { transform: translateX(-100%) translateY(0); opacity: 0; }
  20% { opacity: 0.5; }
  80% { opacity: 0.5; }
  100% { transform: translateX(200%) translateY(20px); opacity: 0; }
}
.speed-line {
  position: absolute; height: 3px; background: linear-gradient(90deg, transparent, var(--coral), var(--yellow), transparent);
  width: 400px; pointer-events: none; opacity: 0; filter: blur(1px);
  animation: speed-line 2s linear infinite; z-index: 1;
}
[data-theme="dark"] #hero {
  background-color: #0b0e14;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15), transparent 60%),
    var(--halftone);
  background-size: 100% 100%, 30px 30px;
  position: relative; overflow: hidden;
}
[data-theme="dark"] #hero::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(0, 242, 255, 0.05), transparent 40%);
  animation: pulse-glow 10s ease-in-out infinite; z-index: 0;
}
@keyframes burst-pop {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) translateY(-20px); opacity: 0; }
}
@keyframes speed-line {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateX(100%); opacity: 0; }
}
@keyframes heading-pop {
  0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes ink-wipe-diagonal {
  0% { transform: translateX(-100%) skewX(-15deg); }
  50% { transform: translateX(0) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
@keyframes transition-pop {
  0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.5) rotate(5deg); opacity: 1; }
  100% { transform: scale(2) rotate(15deg); opacity: 0; }
}
.transition-word {
  position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);
  font-family: 'Bangers', cursive; font-size: 180px; color: var(--yellow);
  text-shadow: 10px 10px 0 var(--ink); z-index: 100001;
  pointer-events: none; animation: transition-pop 0.6s var(--cb-pop) forwards;
}
@keyframes impact-flash {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes curtain-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
@keyframes curtain-right {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
@keyframes logo-fade {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.5); }
}
@keyframes magnetic-pull {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(2px, -2px); }
}

/* BURST SHAPES */
.burst-shape {
  position: fixed; pointer-events: none; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bangers', cursive; color: var(--ink);
  text-shadow: 2px 2px 0 white;
}
.burst-sticker {
  background: var(--yellow); border: 3px solid var(--ink);
  padding: 8px 16px; border-radius: 8px; transform: rotate(-5deg);
  box-shadow: 4px 4px 0 var(--ink);
}
.burst-star {
  width: 100px; height: 100px;
  background: var(--coral);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  display: flex; align-items: center; justify-content: center;
}
.burst-text { 
  font-family: 'Bangers', cursive;
  font-size: 26px; color: #1a1a2e; 
  letter-spacing: 0.5px;
  pointer-events: none; 
  -webkit-font-smoothing: antialiased;
}

.name-animate { animation: wipe-in 1s cubic-bezier(0.77,0,0.175,1) forwards; }
.name-animate-2 { animation: wipe-in 1s cubic-bezier(0.77,0,0.175,1) 0.3s forwards; clip-path:inset(0 100% 0 0); }

/* HERO QUICK FACTS */
.hero-quick-facts {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px;
}
.hero-quick-facts span {
  font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
  background: var(--yellow); color: var(--ink);
  padding: 4px 12px; border-radius: 3px;
  border: 2px solid var(--ink); box-shadow: 2px 2px 0 var(--ink);
}
[data-theme="dark"] .hero-quick-facts span {
  background: rgba(124,58,237,0.3); color: var(--coral); border-color: var(--coral);
  box-shadow: 2px 2px 0 var(--coral);
}

/* SKILL TAG CLOUD */
.skill-categories-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 24px; margin-top: 48px;
}
@media(max-width:768px){ .skill-categories-grid { grid-template-columns: 1fr; } }
.skill-category-panel {
  background: var(--panel-bg); border: 2.5px solid var(--ink);
  padding: 20px 22px; border-radius: 4px;
  box-shadow: var(--panel-shadow); backdrop-filter: blur(5px);
}
.skill-tag-cloud {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;
}
.skill-tag {
  font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 12px;
  padding: 5px 13px; border: 2px solid var(--ink); border-radius: 20px;
  background: var(--cream); color: var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
  transition: all 0.2s var(--cb-pop); cursor: default;
}
.skill-tag:hover {
  background: var(--ink); color: var(--cream);
  transform: translate(-1px,-1px); box-shadow: 3px 3px 0 var(--coral);
}
[data-theme="dark"] .skill-tag {
  background: rgba(255,255,255,0.05); color: var(--ink);
}
[data-theme="dark"] .skill-tag:hover {
  background: var(--coral); color: #000;
}

/* ARCHITECTURE PANEL */
.project-card-actions {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto;
}
.project-arch-btn {
  background: var(--teal); color: var(--ink);
  cursor: none;
}
[data-theme="dark"] .project-arch-btn { color: #000; }
.arch-panel {
  margin-top: 16px; border-top: 2px dashed var(--ink); padding-top: 14px;
  animation: wipe-in 0.3s ease forwards;
}
.arch-title {
  font-family: 'Bangers', cursive; font-size: 14px;
  color: var(--coral); margin-bottom: 8px; letter-spacing: 1px;
}
.arch-flow {
  font-family: 'Nunito', monospace; font-size: 11px; line-height: 1.8;
  color: var(--ink); white-space: pre-wrap; word-break: break-word;
  background: rgba(0,0,0,0.04); border-radius: 4px;
  padding: 10px 14px; border: 1.5px solid rgba(0,0,0,0.1);
}
[data-theme="dark"] .arch-flow {
  background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);
}

/* CURRENTLY BUILDING */
#currently-building {
  padding: 70px 60px; background: var(--ink);
  border-top: 3px solid var(--yellow);
}
#currently-building .section-title { color: var(--yellow); }
#currently-building .section-title::after { background: var(--coral); }
.building-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 22px; margin-top: 36px;
}
@media(max-width:768px){ .building-grid { grid-template-columns: 1fr; } }
.building-item {
  background: rgba(255,255,255,0.05); border: 2.5px solid var(--yellow);
  border-radius: 4px; padding: 22px;
  box-shadow: 4px 4px 0 var(--coral);
  transition: all 0.25s var(--cb-pop);
}
.building-item:hover {
  transform: translate(-4px,-4px); box-shadow: 8px 8px 0 var(--coral);
}
.building-item-icon { font-size: 26px; margin-bottom: 10px; }
.building-item-title {
  font-family: 'Bangers', cursive; font-size: 18px;
  color: var(--yellow); letter-spacing: 1px; margin-bottom: 6px;
}
.building-item-desc {
  font-family: 'Nunito', sans-serif; font-size: 13px;
  color: rgba(255,255,255,0.72); line-height: 1.5;
}

/* CONTACT AVAILABILITY */
.contact-availability {
  font-family: 'Permanent Marker', cursive; font-size: 16px;
  color: var(--teal); text-align: center;
  margin: 28px auto 0; padding: 14px 28px; max-width: 600px;
  border: 2px dashed var(--teal); border-radius: 8px;
}
`;

const skillCategories = [
  {
    title: "AI / ML & Agentic AI", emoji: "🧠",
    tags: ["PyTorch", "LangChain", "FAISS", "BERT", "Ollama", "LLM Integration", "RAG Pipelines", "OpenCV", "CBAM", "U-Net"]
  },
  {
    title: "Backend & APIs", emoji: "⚙️",
    tags: ["Python", "Java", "TypeScript", "JavaScript", "C#", "C++", "SQL", "FastAPI", "Flask", "Node.js", "ASP.NET", "REST API Design", "Webhooks", "High Throughput Ingestion"]
  },
  {
    title: "Databases", emoji: "💾",
    tags: ["PostgreSQL", "MongoDB", "DynamoDB", "Snowflake", "Neo4j", "Query Optimization", "Schema Design", "Data Modeling"]
  },
  {
    title: "Cloud & Infrastructure", emoji: "☁️",
    tags: ["AWS (S3, Lambda, DynamoDB, EC2)", "Docker", "Kubernetes", "CI/CD", "Git", "Distributed Orchestration", "Azure DevOps"]
  },
  {
    title: "Fundamentals", emoji: "📚",
    tags: ["Data Structures", "Algorithms", "OOP", "System Design", "Code Review", "Unit Testing", "Agile"]
  }
];

const projects = [
  {
    id: "01", title: "RepoMind: Autonomous Engineering Intelligence Platform",
    tags: ["TypeScript", "React", "React Flow", "Neo4j", "AST Parsing"],
    description: "Architected a graph-based software intelligence platform capable of processing 1,000+ AST-parsed entities and 3,000+ dependency relationships. Implemented a custom TypeScript edge projection engine and interactive layout pipeline (useExplorerLayout), boosting UI rendering performance by 98%+ with sub-second rendering latency.",
    metric: "98%+ Rendering Speedup", status: "PRODUCTION", statusColor: "var(--teal)",
    link: "https://github.com/shriya-1603/RepoMind",
    architecture: `Source Code → AST Parser → Entity Extraction (1,000+ nodes, 3,000+ edges)
                                         ↓
    TypeScript Edge Projection Engine → Neo4j Graph DB
                                         ↓
    React Flow UI (useExplorerLayout) with Incremental Rendering`
  },
  {
    id: "02", title: "RAG Document Q&A: REST API with Third-Party LLM Integration",
    tags: ["Python", "LangChain", "FAISS", "Ollama", "Llama 3"],
    description: "Engineered a configurable ingestion and retrieval pipeline using LangChain and FAISS with 1,000-token chunks, 200-token overlap, and top-k = 4 retrieval, achieving sub-2ms vector lookup latency on in-memory indices. Benchmarked cloud versus local generation backends (1.2–2.5s vs. 3.5–7.5s latency) and validated swappable 768-dim and 3072-dim embedding models to balance retrieval accuracy against memory footprint.",
    metric: "Sub-2ms Retrieval", status: "PRODUCTION", statusColor: "var(--teal)",
    link: "https://github.com/shriya-1603/rag-qa-system",
    demo: "https://rag-app-system.streamlit.app/",
    architecture: `Upload (PDF/DOCX/TXT) → Asynchronous Ingestion & Parsing
                                         ↓
    Semantic Chunking & Embedding → Persistent FAISS Vector DB
                                         ↓
    User Query → LangChain Retriever → Local Llama 3 (Ollama)`
  },
  {
    id: "03", title: "Uncertainty-Aware MRI-to-CT Synthesis (MS Capstone)",
    tags: ["PyTorch", "CBAM U-Net", "Deep Ensembles", "MC Dropout"],
    description: "Architected a multi-architecture U-Net pipeline using PyTorch to synthesize physically grounded synthetic CT scans from brain MRI volumes. Integrated a CBAM module to optimize feature re-weighting at bone-tissue interfaces (51.4 HU MAE) and engineered a voxel-wise uncertainty quantification engine via Deep Ensembles and MC Dropout.",
    metric: "51.4 HU MAE", status: "RESEARCH", statusColor: "var(--coral)",
    link: "https://github.com/shriya-1603/uncertainty-aware-mri-ct-synthesis",
    architecture: `Brain MRI Input → CBAM U-Net Pipeline → Synthetic CT Scan
                                      ↓
    Voxel-wise Uncertainty Quantification (Deep Ensembles + MC Dropout)
                                      ↓
    Predicted Variance Maps vs Actual Voxel Error (ρ=0.7886 Correlation)`
  },
  {
    id: "04", title: "Real-Time Computer Vision Platform: Distributed Backend Service",
    tags: ["Flask", "React", "OpenCV", "Docker", "CI/CD"],
    description: "Architected a modular full-stack web platform using Flask and OpenCV to consolidate multiple computer vision pipelines. Utilized UUID-based session isolation to handle concurrent environments safely, and engineered low-latency live-streaming feeds and manual Wiener deconvolution algorithms from scratch.",
    metric: "Low-latency MJPEG", status: "COMPLETE", statusColor: "var(--teal)",
    link: "https://github.com/shriya-1603/CV_consolidated",
    architecture: `Client (React UI) → REST API Gateway (Flask Backend)
                                         ↓
    UUID Session Isolation → Concurrent Runtime Environments
                                         ↓
    OpenCV Image Pipelines (Live MJPEG Streams & Wiener Deconvolution)`
  },
  {
    id: "05", title: "The Embedding Gazette: Interactive NLP News Explorer",
    tags: ["Python", "Streamlit", "Transformers", "scikit-learn", "NLP"],
    description: "Engineered an end-to-end NLP system comparing 5 text representations (Bag-of-Words to fine-tuned BERT) achieving up to 94.2% classification accuracy. Developed a newspaper-themed Streamlit UI featuring a real-time BBC RSS headlines classifier and an interactive t-SNE embedding space visualization for 1,500+ articles.",
    metric: "94.2% BERT Accuracy", status: "PRODUCTION", statusColor: "var(--teal)",
    link: "https://github.com/shriya-1603/Automated-News-Categorizaton-Using-Deep-Learning-and-Machine-Learning",
    demo: "https://huggingface.co/spaces/shriya-1603/news-embedding-explorer",
    architecture: `News Text / RSS Feed → Preprocessing & Cleaning (NLTK)
                                         ↓
    Feature Extraction (BoW / TF-IDF / Word2Vec / BERT / Fine-tuned BERT)
                                         ↓
    Classifier Suite (Naive Bayes / Logistic Regression / BERT Sequence Classification)
                                         ↓
    Visualisations (Plotly t-SNE) & Streamlit Newspaper Front-end`
  }
];

const expressions = {
  wave:     { mouthD: "M 190 235 C 195 245 205 245 210 235", eyebrowDY: 0,  anim: "bob 3s ease-in-out infinite",            armState: "waving",      bubble: "Hi! I'm Shriya 👋" },
  thinking: { mouthD: "M 192 238 C 195 240 205 240 208 238", eyebrowDY: -4, anim: "bob 4s ease-in-out infinite",            armState: "default",     bubble: "Let me introduce myself..." },
  serious:  { mouthD: "M 190 245 C 195 235 205 235 210 245",                  eyebrowDY: 8,  anim: "bob 4s ease-in-out infinite",            armState: "power-pose",   bubble: "These are my powers 🔥", eyeType: "fire", hasHeadband: true },
  excited:  { mouthD: "M 185 235 C 195 255 205 255 215 235", eyebrowDY: -6, anim: "excited-bounce 0.8s ease-in-out infinite",armState: "raised-both", bubble: "Check these out! 🚀" },
  bye:      { mouthD: "M 190 235 C 195 245 205 245 210 235", eyebrowDY: 0,  anim: "bob 3s ease-in-out infinite",            armState: "waving",      bubble: "Let's connect! 💌" },
};

const sectionExpressions = { hero: "wave", about: "thinking", experience: "thinking", skills: "serious", projects: "excited", contact: "bye" };

const badges = [
  { t: "MS Computer Science (3.99 GPA)", bg: "var(--yellow)" },
  { t: "B.Tech AI & ML (3.7 GPA)", bg: "var(--coral)" },
  { t: "Former Associate SWE @ Micron", bg: "var(--teal)" },
  { t: "Graduate Research Assistant @ GSU", bg: "#ff5e62" },
  { t: "Oracle Fusion AI Agent Studio", bg: "var(--yellow)" },
  { t: "AWS Certified Practitioner", bg: "var(--coral)" }
];

function lerp(a, b, t) { return a + (b - a) * t; }

function Character({ expression, eyeOffset }) {
  const expr = expressions[expression] || expressions.wave;
  const { mouthD, eyebrowDY, anim, armState, bubble, eyeType, hasHeadband } = expr;
  
  const ex = eyeOffset ? Math.max(-6,Math.min(6,eyeOffset.x*8)) : 0;
  const ey = eyeOffset ? Math.max(-6,Math.min(6,eyeOffset.y*8)) : 0;
  
  const sk = "#ffe3d1"; 
  const skD = "#e0ad94"; 
  const hr = "#1a120d"; 
  const hrH = "#704126"; 
  const dr = "#292728"; 
  const drD = "#1c1a1b"; 
  const sh = "#ffffff"; 
  
  return (
    <div className="character-wrap" style={{animation:anim}}>
      {bubble&&<div className="speech-bubble" style={{bottom: "325px", left: "50%", transform: "translateX(-50%)"}} key={bubble}>{bubble}</div>}
      <svg className="character-svg" viewBox="0 0 400 600" width="220" style={{overflow:"visible",display:"block"}} aria-hidden="true">
        <defs>
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={hr} /><stop offset="50%" stopColor={hrH} /><stop offset="100%" stopColor={hr} />
          </linearGradient>
          <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffff00" />
            <stop offset="40%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff0000" />
          </linearGradient>
        </defs>

        <path d="M 130 150 C 110 200 110 400 130 460 C 160 480 240 480 270 460 C 290 400 290 200 270 150 Z" fill={hr}/>
        
        <path d="M 180 260 L 180 300 L 220 300 L 220 260 Z" fill={sk}/>
        <path d="M 180 260 L 180 280 L 220 280 L 220 260 Z" fill={skD} opacity="0.6"/>
        
        {armState === "waving" ? (
          <>
            <path d="M 120 350 C 90 420 80 500 85 540 C 95 550 110 540 105 500 C 100 450 130 380 140 350 Z" fill={sk}/>
            <g stroke={sk} strokeWidth="7" strokeLinecap="round">
              <path d="M 98 545 L 102 570"/>
              <path d="M 92 545 L 92 575"/>
              <path d="M 86 545 L 82 570"/>
              <path d="M 80 545 L 76 560"/>
              <path d="M 96 545 L 104 555"/>
            </g>
            <circle cx="89" cy="545" r="12" fill={sk}/>
            <g transform="translate(90, 530)">
              <circle cx="-10" cy="0" r="4" fill="#e62e2e"/><circle cx="-4" cy="2" r="4" fill="#b31b1b"/><circle cx="2" cy="3" r="4" fill="#e62e2e"/><circle cx="8" cy="2" r="4" fill="#b31b1b"/><circle cx="14" cy="-1" r="4" fill="#e62e2e"/>
            </g>
            <g style={{transformOrigin: "290px 340px", animation: "wave 0.8s ease-in-out infinite"}}>
              <circle cx="290" cy="340" r="22" fill={sk}/>
              <path d="M 280 350 C 320 300 340 240 345 190 C 355 180 365 195 360 215 C 350 260 320 330 295 360 Z" fill={sk}/>
              <g stroke={sk} strokeWidth="8" strokeLinecap="round">
                <path d="M 338 180 L 330 145"/>
                <path d="M 344 180 L 340 135"/>
                <path d="M 350 180 L 350 130"/>
                <path d="M 356 180 L 360 135"/>
                <path d="M 335 185 L 320 170"/>
              </g>
              <circle cx="347" cy="180" r="14" fill={sk}/>
              <g transform="translate(352, 215) rotate(-20)">
                <rect x="-12" y="-6" width="24" height="12" fill="#d1d1d1" rx="3"/>
                <rect x="-8" y="-9" width="16" height="18" fill="#222" rx="4"/>
                <rect x="-5" y="-6" width="10" height="12" fill="#fff" rx="2"/>
              </g>
            </g>
          </>
        ) : armState === "power-pose" ? (
          <>
            <g style={{transformOrigin: "110px 340px"}}>
              <circle cx="110" cy="340" r="22" fill={sk}/>
              <path d="M 110 340 L 60 420 L 115 455" stroke={sk} strokeWidth="24" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 115 455 Q 130 455 130 440" stroke={sk} strokeWidth="24" fill="none" strokeLinecap="round"/>
            </g>
            <g style={{transformOrigin: "290px 340px", animation: "shiver 0.2s linear infinite"}}>
              <circle cx="290" cy="340" r="22" fill={sk}/>
              <path d="M 290 340 C 330 300 350 240 355 140" stroke={sk} strokeWidth="24" fill="none" strokeLinecap="round"/>
              <rect x="340" y="115" width="28" height="28" rx="10" fill={sk} stroke={skD} strokeWidth="1"/>
            </g>
          </>
        ) : armState === "raised-both" || armState === "fists-raised" ? (
          <>
            <g style={{
              transformOrigin: "110px 340px", 
              animation: armState === "fists-raised" ? "shiver 0.15s linear infinite" : "wave 0.9s 0.2s ease-in-out infinite"
            }}>
              <circle cx="110" cy="340" r="22" fill={sk}/>
              <path d="M 120 350 C 80 300 60 240 55 190 C 45 180 35 195 40 215 C 50 260 80 330 105 360 Z" fill={sk}/>
              {armState === "fists-raised" ? (
                <rect x="35" y="165" width="24" height="24" rx="10" fill={sk} stroke={skD} strokeWidth="1"/>
              ) : (
                <g stroke={sk} strokeWidth="8" strokeLinecap="round">
                  <path d="M 56 180 L 64 145"/><path d="M 50 180 L 54 135"/><path d="M 44 180 L 44 130"/><path d="M 38 180 L 34 135"/><path d="M 59 185 L 74 170"/>
                </g>
              )}
              <circle cx="47" cy="180" r="14" fill={sk}/>
              <g transform="translate(50, 215) rotate(20)">
                <circle cx="-10" cy="0" r="4" fill="#e62e2e"/><circle cx="-4" cy="2" r="4" fill="#b31b1b"/><circle cx="2" cy="3" r="4" fill="#e62e2e"/><circle cx="8" cy="2" r="4" fill="#b31b1b"/><circle cx="14" cy="-1" r="4" fill="#e62e2e"/>
              </g>
            </g>
            <g style={{
              transformOrigin: "290px 340px", 
              animation: armState === "fists-raised" ? "shiver 0.15s linear infinite" : "wave 0.8s ease-in-out infinite"
            }}>
              <circle cx="290" cy="340" r="22" fill={sk}/>
              <path d="M 280 350 C 320 300 340 240 345 190 C 355 180 365 195 360 215 C 350 260 320 330 295 360 Z" fill={sk}/>
              {armState === "fists-raised" ? (
                <rect x="340" y="165" width="24" height="24" rx="10" fill={sk} stroke={skD} strokeWidth="1"/>
              ) : (
                <g stroke={sk} strokeWidth="8" strokeLinecap="round">
                  <path d="M 338 180 L 330 145"/><path d="M 344 180 L 340 135"/><path d="M 350 180 L 350 130"/><path d="M 356 180 L 360 135"/><path d="M 335 185 L 320 170"/>
                </g>
              )}
              <circle cx="347" cy="180" r="14" fill={sk}/>
              <g transform="translate(352, 215) rotate(-20)">
                <rect x="-12" y="-6" width="24" height="12" fill="#d1d1d1" rx="3"/>
                <rect x="-8" y="-9" width="16" height="18" fill="#222" rx="4"/>
                <rect x="-5" y="-6" width="10" height="12" fill="#fff" rx="2"/>
              </g>
            </g>
          </>
        ) : (
          <>
            <path d="M 120 350 C 90 420 80 500 85 540 C 95 550 110 540 105 500 C 100 450 130 380 140 350 Z" fill={sk}/>
            <g stroke={sk} strokeWidth="7" strokeLinecap="round">
              <path d="M 98 545 L 102 570"/>
              <path d="M 92 545 L 92 575"/>
              <path d="M 86 545 L 82 570"/>
              <path d="M 80 545 L 76 560"/>
              <path d="M 96 545 L 104 555"/>
            </g>
            <circle cx="89" cy="545" r="12" fill={sk}/>
            <g transform="translate(90, 530)">
              <circle cx="-10" cy="0" r="4" fill="#e62e2e"/><circle cx="-4" cy="2" r="4" fill="#b31b1b"/><circle cx="2" cy="3" r="4" fill="#e62e2e"/><circle cx="8" cy="2" r="4" fill="#b31b1b"/><circle cx="14" cy="-1" r="4" fill="#e62e2e"/>
            </g>
            <path d="M 280 350 C 310 420 320 500 315 540 C 305 550 290 540 295 500 C 300 450 270 380 260 350 Z" fill={sk}/>
            <g stroke={sk} strokeWidth="7" strokeLinecap="round">
              <path d="M 296 545 L 292 570"/>
              <path d="M 302 545 L 302 575"/>
              <path d="M 308 545 L 312 570"/>
              <path d="M 314 545 L 318 560"/>
              <path d="M 298 545 L 290 555"/>
            </g>
            <circle cx="305" cy="545" r="12" fill={sk}/>
            <g transform="translate(305, 530)">
              <rect x="-12" y="-6" width="24" height="12" fill="#d1d1d1" rx="3"/>
              <rect x="-8" y="-9" width="16" height="18" fill="#222" rx="4"/>
              <rect x="-5" y="-6" width="10" height="12" fill="#fff" rx="2"/>
            </g>
          </>
        )}
        
        <path d="M 140 290 C 120 320 120 340 130 370 L 270 370 C 280 340 280 320 260 290 C 230 320 170 320 140 290 Z" fill={sh}/>
        
        {armState === "raised-both" ? (
          <>
            <path d="M 140 290 C 120 290 90 300 75 320 C 90 340 120 360 135 360 Z" fill={sh}/>
            <path d="M 75 320 Q 90 340 105 340 Q 120 350 135 360" stroke="#eee" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M 140 290 C 110 300 80 330 75 360 C 90 375 120 380 135 360 Z" fill={sh}/>
            <path d="M 75 360 Q 90 385 105 365 Q 120 385 135 360" stroke="#eee" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </>
        )}

        {(armState === "waving" || armState === "raised-both") ? (
          <>
            <path d="M 260 290 C 280 290 310 300 325 320 C 310 340 280 360 265 360 Z" fill={sh}/>
            <path d="M 325 320 Q 310 340 295 340 Q 280 350 265 360" stroke="#eee" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M 260 290 C 290 300 320 330 325 360 C 310 375 280 380 265 360 Z" fill={sh}/>
            <path d="M 325 360 Q 310 385 295 365 Q 280 385 265 360" stroke="#eee" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </>
        )}
        
        <path d="M 130 450 C 90 530 80 600 80 600 L 320 600 C 320 600 310 530 270 450 Z" fill={dr}/>
        <path d="M 150 450 C 140 530 140 600 140 600" stroke={drD} strokeWidth="3" fill="none"/>
        <path d="M 250 450 C 260 530 260 600 260 600" stroke={drD} strokeWidth="3" fill="none"/>
        <path d="M 200 450 C 200 530 200 600 200 600" stroke={drD} strokeWidth="3" fill="none"/>
        <path d="M 140 340 L 260 340 L 270 450 L 130 450 Z" fill={dr}/>
        <path d="M 145 300 L 140 340 L 160 340 L 165 300 Z" fill={dr}/>
        <path d="M 255 300 L 260 340 L 240 340 L 235 300 Z" fill={dr}/>
        <path d="M 128 440 L 272 440 L 274 455 L 126 455 Z" fill="#141314"/>

        <path d="M 130 180 C 130 240 155 260 200 265 C 245 260 270 240 270 180 C 270 120 130 120 130 180 Z" fill={sk}/>
        
        <ellipse cx="125" cy="210" rx="12" ry="18" fill={sk}/>
        <ellipse cx="275" cy="210" rx="12" ry="18" fill={sk}/>
        
        <circle cx="120" cy="235" r="14" fill="none" stroke="#ddd" strokeWidth="3.5"/>
        <circle cx="280" cy="235" r="14" fill="none" stroke="#ddd" strokeWidth="3.5"/>
        
        {expression === "bye" ? (
          <g>
            <path d="M 150 195 C 160 175 175 175 185 195" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M 150 195 L 143 190" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 215 195 C 225 175 240 175 250 195" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M 250 195 L 257 190" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </g>
        ) : eyeType === "fire" ? (
          <g>
            <g transform="translate(167, 195) scale(0.63)">
              <text x="0" y="15" fontSize="40" textAnchor="middle">🔥</text>
            </g>
            <g transform="translate(232, 195) scale(0.63)">
              <text x="0" y="15" fontSize="40" textAnchor="middle">🔥</text>
            </g>
          </g>
        ) : eyeType === "sparks" ? (
          <g>
            <g transform="translate(167, 195) scale(0.72)">
              <path d="M 10 -20 L -15 5 L 5 5 L -10 25 L 20 -5 L 0 -5 Z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round"/>
            </g>
            <g transform="translate(232, 195) scale(0.72)">
              <path d="M 10 -20 L -15 5 L 5 5 L -10 25 L 20 -5 L 0 -5 Z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round"/>
            </g>
          </g>
        ) : (
          <g style={{transformOrigin: "200px 195px", animation:"blink 5s ease-in-out infinite"}}>
            <path d="M 150 200 C 150 170 185 170 185 200 C 185 215 150 215 150 200 Z" fill="white"/>
            <ellipse cx={167.5+ex} cy={195+ey} rx="12" ry="16" fill="#4a2511"/>
            <circle cx={167.5+ex} cy={195+ey} r="6" fill="#000"/>
            <circle cx={173+ex} cy={185+ey} r="4.5" fill="white"/>
            <circle cx={160+ex} cy={203+ey} r="2.5" fill="white"/>
            <path d="M 145 195 C 155 165 185 165 190 195" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M 145 195 L 138 190" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>

            <path d="M 215 200 C 215 170 250 170 250 200 C 250 215 215 215 215 200 Z" fill="white"/>
            <ellipse cx={232.5+ex} cy={195+ey} rx="12" ry="16" fill="#4a2511"/>
            <circle cx={232.5+ex} cy={195+ey} r="6" fill="#000"/>
            <circle cx={238+ex} cy={185+ey} r="4.5" fill="white"/>
            <circle cx={225+ex} cy={203+ey} r="2.5" fill="white"/>
            <path d="M 210 195 C 215 165 245 165 255 195" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M 255 195 L 262 190" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </g>
        )}

        {expression === "serious" ? (
          <g>
            <path d={`M 150 ${165+eyebrowDY} L 185 ${180+eyebrowDY}`} stroke="#2d1c15" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d={`M 250 ${165+eyebrowDY} L 215 ${180+eyebrowDY}`} stroke="#2d1c15" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </g>
        ) : (
          <g>
            <path d={`M 150 ${165+eyebrowDY} Q 167 ${155+eyebrowDY} 185 ${165+eyebrowDY}`} stroke="#2d1c15" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d={`M 250 ${165+eyebrowDY} Q 233 ${155+eyebrowDY} 215 ${165+eyebrowDY}`} stroke="#2d1c15" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </g>
        )}

        <circle cx="200" cy="220" r="1.5" fill={skD}/>

        <ellipse cx="160" cy="215" rx="16" ry="10" fill="#ff7b7b" opacity="0.5"/>
        <path d="M 152 215 L 158 210 M 160 216 L 166 211 M 168 217 L 174 212" stroke="#e06666" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <ellipse cx="240" cy="215" rx="16" ry="10" fill="#ff7b7b" opacity="0.5"/>
        <path d="M 232 215 L 238 210 M 240 216 L 246 211 M 248 217 L 254 212" stroke="#e06666" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>

        <path d={mouthD} stroke="#ba5a5a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

        <path d="M 200 80 C 140 80 100 120 100 220 C 100 280 120 300 120 320 C 120 350 90 380 90 420 C 90 460 130 480 150 450 C 140 400 145 350 145 300 C 145 250 125 200 140 180 C 155 160 180 130 200 130 Z" fill={hr}/>
        
        <path d="M 200 80 C 260 80 300 120 300 220 C 300 280 280 300 280 320 C 280 350 310 380 310 420 C 310 460 270 480 250 450 C 260 400 255 350 255 300 C 255 250 275 200 260 180 C 245 160 220 130 200 130 Z" fill={hr}/>

        <path d="M 125 220 C 115 280 140 300 140 320 C 140 350 105 380 105 420" stroke={hrH} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        <path d="M 275 220 C 285 280 260 300 260 320 C 260 350 295 380 295 420" stroke={hrH} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>

        <path d="M 200 80 L 200 130" stroke={skD} strokeWidth="1" fill="none" opacity="0.1" strokeLinecap="round"/>

        {hasHeadband && (
          <g transform="translate(0, 150)">
            <path d="M 120 5 C 150 -5 250 -5 280 5 L 280 30 C 250 20 150 20 120 30 Z" fill="white" stroke={hr} strokeWidth="3"/>
            <circle cx="280" cy="18" r="14" fill="white" stroke={hr} strokeWidth="3"/>
            <path d="M 285 25 C 310 30 335 60 330 90 L 310 95 C 315 70 300 50 285 35 Z" fill="white" stroke={hr} strokeWidth="3"/>
            <path d="M 285 15 C 320 0 350 20 360 50 L 340 60 C 335 40 310 25 285 20 Z" fill="white" stroke={hr} strokeWidth="3"/>
          </g>
        )}

        </svg>
    </div>
  );
}

function HeroSection({ scrollToSection }) {
  return (
    <section id="hero">
      <div className="speed-line" style={{top: '20%', left: '-10%', animationDelay: '0s'}}></div>
      <div className="speed-line" style={{top: '50%', left: '-20%', animationDelay: '1.5s'}}></div>
      <div className="speed-line" style={{top: '80%', left: '-5%', animationDelay: '0.8s'}}></div>
      
      <div className="hero-symbols">
        <div className="symbol symbol-1">BAM!</div>
        <div className="symbol symbol-2">POW!</div>
        <div className="symbol symbol-3">★</div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="name-animate" style={{display:"block"}}>SHRIYA</span>
          <span className="name-animate-2" style={{display:"block",color:"var(--coral)"}}>KOTALA</span>
        </h1>
        <p className="hero-sub reveal" style={{transitionDelay:"0.5s"}}>
          AI/ML Engineer building Agentic AI systems, LLM workflows, and production-ready ML applications.
          <span className="hero-quick-facts">
            <span>🎓 MS CS @ Georgia State (3.99 GPA)</span>
            <span>💼 Former Associate SWE @ Micron</span>
            <span>🚀 Open to AI/ML &amp; SWE Roles</span>
          </span>
        </p>
        <div className="hero-actions reveal" style={{transitionDelay:"0.6s"}}>
          <button className="btn btn-primary" onClick={()=>scrollToSection("projects")}>VIEW MISSION →</button>
          <button className="btn btn-outline" onClick={()=>scrollToSection("contact")}>SIGNAL ME</button>
        </div>
      </div>
      <div className="hero-portrait reveal" style={{transitionDelay:"0.7s"}}>
        <img src="/headshot.jpg" alt="Shriya Kotala Portrait" />
      </div>
    </section>
  );
}

function WaveDivider({ from, to, flip }) {
  return (
    <div style={{display:"block",lineHeight:0,overflow:"hidden",transform:flip?"scaleY(-1)":"none"}}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" width="100%" height="60">
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill={to}/>
      </svg>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <WaveDivider from="var(--cream)" to="var(--cream)"/>
      <div style={{textAlign:"left",marginBottom:0}}>
        <h2 className="section-title">MISSION PROFILE</h2>
      </div>
      <div className="about-grid">
        <div className="dossier-card reveal-left">
          <div className="dossier-header">📁 AGENT PROFILE: SHRIYA KOTALA</div>
          <div className="dossier-body">
            {[
              {icon:"🎓",label:"Education",val:"MS Computer Science, GSU (3.99)"},
              {icon:"📜",label:"Undergrad",val:"B.Tech CS (AI & ML), KMIT (3.7)"},
              {icon:"💼",label:"Experience",val:"Graduate Research Assistant & Former Associate SWE"},
              {icon:"🛠️",label:"Versatility",val:"AI/ML & Software Engineering"},
              {icon:"🚀",label:"Goal",val:"AI/ML Engineer / SWE Roles"},
            ].map(r=>(
              <div key={r.label} className="dossier-row">
                <span className="dossier-icon">{r.icon}</span>
                <span className="dossier-label">{r.label}</span>
                <span>{r.val}</span>
              </div>
            ))}
          </div>
          <div className="confidential-stamp">CLASSIFIED</div>
        </div>
        <div>
          <div className="comic-panel reveal-right" style={{transitionDelay:"0.1s"}}>
            <div className="panel-num">[01] THE ENGINEER</div>
            <p style={{lineHeight:1.7,fontSize:14}}>
              AI/ML engineer with experience building production-ready ML systems, evaluation pipelines, and scalable software solutions. I work at the intersection of Artificial Intelligence and Software Engineering, bridging research-grade models with robust, production-ready applications. Pursuing MS Computer Science at Georgia State University (3.99 GPA).
            </p>
          </div>
          <div className="comic-panel reveal-right" style={{transitionDelay:"0.2s"}}>
            <div className="panel-num">[02] PRODUCTION-READY</div>
            <p style={{lineHeight:1.7,fontSize:14}}>
              As an Associate Software Engineer at Micron Technology, I engineered core backend REST APIs using ASP.NET Web API and C#, and integrated high-throughput Snowflake analytics pipelines. I specialize in end-to-end systems that are not just technically advanced, but genuinely reliable, maintainable, and scalable in real-world settings.
            </p>
          </div>
          <div className="comic-panel reveal-right" style={{transitionDelay:"0.3s"}}>
            <div className="panel-num">[03] THE BUILDER</div>
            <p style={{lineHeight:1.7,fontSize:14}}>
              From agentic LLM pipelines and medical imaging systems to containerized CV platforms and full-stack applications, I build systems that ship. A natural problem-solver who thrives when cutting-edge research meets real-world engineering constraints.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const experiences = [
    {
      company: "Georgia State University",
      role: "Graduate Research Assistant, Software Engineering",
      period: "Jan 2025 – May 2026",
      location: "Atlanta, GA",
      bullets: [
        "Architected Project TensorStream, a centralized, event-driven data platform adopted across 6+ faculty research teams to streamline deep learning workflows and cut manual data processing efforts by 40%.",
        "Engineered the core ingestion and serialization layers using Python, PostgreSQL, and DynamoDB, automating the structural validation and tensor normalization of 50,000+ multimodal records to feed downstream neural networks.",
        "Developed a decoupled, asynchronous batch-processing framework using multi-threaded workers, reducing upstream data preparation latency by 35% and entirely eliminating GPU starvation during parallel model training cycles."
      ]
    },
    {
      company: "Micron Technology",
      role: "Associate Software Engineer, Full Stack",
      period: "Jul 2023 – Jul 2024",
      location: "Hyderabad, India",
      bullets: [
        "Engineered core backend REST APIs using ASP.NET Web API and C#, architecting an automated, real-time defect analysis system that boosted factory floor anomaly identification accuracy by 25%.",
        "Optimized enterprise database performance by restructuring MongoDB schemas and indexing strategies, slashing query execution latency by 40% and dropping critical API response times by 200ms.",
        "Integrated high-throughput Snowflake analytics pipelines and orchestrated Docker-based microservice deployments via Azure DevOps, earning the Best Debutant Award."
      ]
    },
    {
      company: "Keshav Memorial Institute of Technology",
      role: "R&D Software Engineering Intern",
      period: "Nov 2022 – May 2023",
      location: "Hyderabad, India",
      bullets: [
        "Co-developed the Legacy Digitization Engine, engineering an end-to-end computer vision and localization pipeline using Python and OpenCV to automate textual extraction and multilingual translation across 1,500+ scanned engineering schemas.",
        "Developed an oriented-text localization layer and adaptive contrast filters to isolate non-horizontal scripts, optimizing bounding-box alignment and reducing downstream OCR parsing errors by 28%.",
        "Architected multi-threaded batch processing components to parallelize heavy pixel matrix transformations, slashing total file execution runtime by 35% while eliminating system memory leaks."
      ]
    }
  ];

  return (
    <section id="experience" style={{ padding: "80px 60px", background: "var(--cream)", borderTop: "2.5px solid var(--ink)" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 className="section-title">SERVICE RECORD</h2>
        <p className="section-subtitle reveal" style={{ transitionDelay: "0.1s" }}>Professional Experience</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "900px", margin: "0 auto" }}>
        {experiences.map((exp, idx) => (
          <div 
            key={exp.company} 
            className="comic-panel reveal" 
            style={{ 
              transitionDelay: `${0.1 + idx * 0.1}s`,
              border: "2.5px solid var(--ink)",
              boxShadow: "var(--panel-shadow)",
              padding: "24px",
              background: "var(--panel-bg)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "12px", borderBottom: "2px solid var(--ink)", paddingBottom: "8px" }}>
              <div>
                <h3 style={{ fontFamily: "'Bangers', cursive", fontSize: "24px", color: "var(--ink)", letterSpacing: "1px" }}>{exp.role.toUpperCase()}</h3>
                <h4 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: "16px", color: "var(--coral)" }}>{exp.company}</h4>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: "bold", fontSize: "14px", display: "block", color: "var(--text-muted)" }}>{exp.period}</span>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "13px", display: "block", color: "var(--teal)", fontWeight: "bold" }}>📍 {exp.location}</span>
              </div>
            </div>
            <ul style={{ paddingLeft: "20px", color: "var(--ink)", fontSize: "14px", lineHeight: "1.6" }}>
              {exp.bullets.map((bullet, bIdx) => (
                <li key={bIdx} style={{ marginBottom: "8px" }}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}


function SkillsSection() {
  return (
    <section id="skills">
      <div style={{textAlign:"center"}}>
        <h2 className="section-title">POWER LEVELS</h2>
        <p className="section-subtitle reveal" style={{transitionDelay:"0.1s"}}>Skills &amp; Technologies</p>
      </div>
      <div className="skill-categories-grid">
        {skillCategories.map((cat, ci) => (
          <div key={cat.title} className="skill-category-panel reveal" style={{transitionDelay:`${0.1+ci*0.1}s`}}>
            <div className="skill-cat-title">{cat.emoji} {cat.title}</div>
            <div className="skill-tag-cloud">
              {cat.tags.map(tag => (
                <span key={tag} className="skill-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="badge-cloud reveal" style={{transitionDelay:"0.5s",justifyContent:"center"}}>
        {badges.map((b,i)=>(
          <span key={b.t} className="badge" style={{background:b.bg,transitionDelay:`${0.4+i*0.05}s`}}>{b.t}</span>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showArch, setShowArch] = useState(false);

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: y * -10 });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div 
      ref={cardRef}
      className="project-card reveal" 
      style={{
        transitionDelay: `${0.1 + i * 0.15}s`,
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(10px)`
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="project-shine" />
      <div className="project-top">
        <span className="project-num">#{p.id}</span>
        <span className="status-badge" style={{background:p.statusColor}}>{p.status}</span>
      </div>
      <div className="project-title">{p.title}</div>
      <p className="project-desc">{p.description}</p>
      <div className="project-metric">STAT: {p.metric}</div>
      <div className="project-tags">{p.tags.map(t=><span key={t} className="project-tag">{t}</span>)}</div>
      <div className="project-card-actions">
        <a className="project-link" href={p.link} target="_blank" rel="noreferrer">VIEW ON GITHUB →</a>
        {p.demo && (
          <a className="project-link" href={p.demo} target="_blank" rel="noreferrer">LIVE DEMO →</a>
        )}
        {p.architecture && (
          <button
            className="project-link project-arch-btn"
            onClick={(e) => { e.stopPropagation(); setShowArch(s => !s); }}
          >
            {showArch ? 'CLOSE ↑' : 'ARCHITECTURE →'}
          </button>
        )}
      </div>
      {p.architecture && showArch && (
        <div className="arch-panel">
          <div className="arch-title">⚡ SYSTEM ARCHITECTURE</div>
          <pre className="arch-flow">{p.architecture}</pre>
        </div>
      )}
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects">
      <div style={{textAlign:"center"}}>
        <h2 className="section-title">CASE FILES</h2>
        <p className="section-subtitle reveal" style={{transitionDelay:"0.1s"}}>Selected Projects</p>
      </div>
      <div className="projects-grid">
        {projects.map((p,i)=>(
          <ProjectCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}


function ContactSection({ formData, setFormData, handleSend }) {
  return (
    <section id="contact">
      <div style={{textAlign:"center"}}>
        <h2 className="section-title">LET'S CONNECT</h2>
        <p className="section-subtitle reveal dots-anim" style={{transitionDelay:"0.1s",color:"var(--teal)"}}>To Be Continued</p>
      </div>
      <div className="contact-icons">
        {[
          {href:"https://outlook.live.com/mail/0/deeplink/compose?to=kotalashriyaa%40gmail.com",label:"Email",icon:<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>},
          {href:"tel:+14048011709",label:"Phone",icon:<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>},
          {href:"https://www.linkedin.com/in/shriya-kotala-4a2655243/",label:"LinkedIn",icon:<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>},
          {href:"https://github.com/shriya-1603",label:"GitHub",icon:<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>},
        ].map(b=>(
          <a key={b.label} href={b.href} className="contact-icon-btn reveal" aria-label={b.label}
            style={{color:"var(--cream)",transitionDelay:"0.2s"}}
            target={b.href.startsWith("http")?"_blank":undefined} rel="noreferrer">
            {b.icon}
          </a>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:20,fontFamily:"'Permanent Marker', cursive",color:"var(--yellow)"}} className="reveal">
        📍 ATLANTA, GEORGIA
      </div>
      <div className="contact-availability reveal" style={{transitionDelay:"0.2s"}}>
        📍 Currently seeking AI/ML Engineer, AI Engineer, and SWE opportunities
      </div>
      <div className="contact-form reveal" style={{transitionDelay:"0.3s"}}>
        <div className="form-row">
          <input id="contact-name" className="form-input" placeholder="YOUR NAME" value={formData.name} 
            onChange={e=>setFormData(f=>({...f,name:e.target.value}))}/>
          <input id="contact-email" className="form-input" placeholder="YOUR EMAIL" value={formData.email}
            onChange={e=>setFormData(f=>({...f,email:e.target.value}))}/>
        </div>
        <textarea id="contact-message" className="form-textarea" placeholder="TRANSMIT MESSAGE..."
          value={formData.msg} onChange={e=>setFormData(f=>({...f,msg:e.target.value}))}/>
        <button id="contact-send" className="btn-send" onClick={handleSend}>SEND IT →</button>
      </div>
      <p className="footer-text">Made with ☕ &amp; comics © 2025 Shriya Kotala</p>
    </section>
  );
}

function ComicBurst({ x, y, text, type }) {
  const rotation = Math.random() * 30 - 15;
  return (
    <div className="burst-shape" style={{left: x, top: y, animation: 'burst-pop 0.6s var(--cb-pop) forwards'}}>
      {type === 'star' ? (
        <div className="burst-star"><span className="burst-text" style={{transform: `rotate(${rotation}deg)`}}>{text}</span></div>
      ) : (
        <div className="burst-sticker"><span className="burst-text" style={{transform: `rotate(${rotation}deg)`}}>{text}</span></div>
      )}
    </div>
  );
}

function CursorTrail({ particles }) {
  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', left: p.x, top: p.y,
          width: p.size, height: p.size,
          background: p.color, borderRadius: p.type === 'dot' ? '50%' : '2px',
          opacity: p.opacity, pointerEvents: 'none', zIndex: 99998,
          transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
          transition: 'opacity 0.2s linear'
        }} />
      ))}
    </>
  );
}

function CurtainIntro({ theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1200);
    const removeTimer = setTimeout(() => setShouldRender(false), 2500);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  if (!shouldRender) return null;

  const isDark = theme === "dark";
  const curtainBg = isDark ? 'var(--teal)' : '#a00';
  const curtainBorder = isDark ? 'rgba(0,0,0,0.2)' : '#800';
  const logoColor = isDark ? 'var(--ink)' : 'var(--yellow)';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200000, display: 'flex', overflow: 'hidden' }}>
      <div style={{
        flex: 1, background: curtainBg, borderRight: `4px solid ${curtainBorder}`,
        animation: isOpen ? 'curtain-left 1.2s cubic-bezier(0.77,0,0.175,1) forwards' : 'none'
      }} />
      <div style={{
        flex: 1, background: curtainBg, borderLeft: `4px solid ${curtainBorder}`,
        animation: isOpen ? 'curtain-right 1.2s cubic-bezier(0.77,0,0.175,1) forwards' : 'none'
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1, pointerEvents: 'none',
        animation: isOpen ? 'logo-fade 0.8s ease-out forwards' : 'none'
      }}>
        <div style={{
          fontFamily: 'Bangers, cursive', fontSize: '150px', color: logoColor,
          textShadow: `8px 8px 0 ${isDark ? 'rgba(0,0,0,0.3)' : 'var(--ink)'}`, letterSpacing: '10px'
        }}>SK</div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [theme, setTheme] = useState("light");
  const [curtainKey, setCurtainKey] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const saved = localStorage.getItem("sk-portfolio-theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sk-portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
    setCurtainKey(prev => prev + 1);
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expression, setExpression] = useState("wave");
  const [cursorPos, setCursorPos] = useState({x:-100,y:-100});
  const [cursorHovered, setCursorHovered] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [formData, setFormData] = useState({name:"",email:"",msg:""});
  const [eyeOffset, setEyeOffset] = useState({x:0,y:0});
  const [bursts, setBursts] = useState([]);
  const [trail, setTrail] = useState([]);

  const cursorRef = useRef({x:-100,y:-100});
  const targetRef = useRef({x:-100,y:-100});
  const eyeTargetRef = useRef({x:0,y:0});
  const eyeCurrRef = useRef({x:0,y:0});
  const rafRef = useRef(null);
  const burstIdRef = useRef(0);
  const trailIdRef = useRef(0);
  const lastTrailPos = useRef({x:0,y:0});

  const getContextText = useCallback((section) => {
    const table = {
      hero: ["SYSTEM ONLINE", "READY!", "WELCOME!"],
      projects: ["ACCESS GRANTED", "CASE OPENED", "MISSION START", "LOADING..."],
      skills: ["XP +100", "LEVEL UP", "SKILL++", "POWER BOOST"],
      contact: ["TRANSMITTING...", "SIGNAL SENT", "CONNECTED", "READY"],
      general: ["BAM!", "POW!", "CLICK!", "ZAP!", "BOOM!", "WHOOSH!"]
    };
    const list = table[section] || table.general;
    const combined = [...list, ...table.general];
    return combined[Math.floor(Math.random() * combined.length)];
  }, []);

  const addBurst = useCallback((x, y) => {
    if (bursts.length >= 2) return;
    const text = getContextText(activeSection);
    const id = ++burstIdRef.current;
    const type = Math.random() > 0.5 ? 'star' : 'sticker';
    setBursts(prev => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id));
    }, 700);
  }, [bursts.length, activeSection, getContextText]);

  useEffect(() => {
    const prevSection = activeSection;
    return () => {
      if (prevSection !== activeSection) {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 800);
      }
    };
  }, [activeSection]);

  // Cursor tracking
  useEffect(()=>{
    const onMove = e=>{
      targetRef.current = {x:e.clientX, y:e.clientY};
      
      // Spawn trail particles if moved enough
      const dist = Math.hypot(e.clientX - lastTrailPos.current.x, e.clientY - lastTrailPos.current.y);
      if (dist > 25) {
        const id = ++trailIdRef.current;
        const p = {
          id, x: e.clientX, y: e.clientY,
          opacity: 0.6, size: Math.random() * 6 + 2,
          color: Math.random() > 0.5 ? 'var(--yellow)' : 'var(--coral)',
          type: Math.random() > 0.7 ? 'star' : 'dot',
          angle: Math.random() * 360
        };
        setTrail(prev => [...prev.slice(-15), p]);
        lastTrailPos.current = {x:e.clientX, y:e.clientY};
      }

      // eye tracking relative to character center
      const charEl = document.querySelector(".character-wrap");
      if(charEl){
        const r = charEl.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + 80;
        const dx = (e.clientX - cx)/window.innerWidth;
        const dy = (e.clientY - cy)/window.innerHeight;
        eyeTargetRef.current = {x:Math.max(-1,Math.min(1,dx*2)), y:Math.max(-1,Math.min(1,dy*2))};
      }
      // hover detection
      const el = document.elementFromPoint(e.clientX,e.clientY);
      const hoverable = el && (el.closest("button")||el.closest("a")||el.closest(".project-card")||el.closest(".contact-icon-btn")||el.closest(".nav-link")||el.closest(".btn-send")||el.closest(".project-tag")||el.closest(".badge"));
      setCursorHovered(!!hoverable);
    };

    const onClick = e => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = el && (
        el.closest("button") || 
        el.closest("a") || 
        el.closest(".project-card") || 
        el.closest(".contact-icon-btn") || 
        el.closest(".nav-link") || 
        el.closest(".btn-send") ||
        el.closest(".project-tag") ||
        el.closest(".badge")
      );
      // Spawn burst for clicks everywhere, but prioritize contextual text for interactive elements
      addBurst(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove",onMove);
    window.addEventListener("mousedown", onClick); // use mousedown for snappier feedback

    const loop = ()=>{
      cursorRef.current.x = lerp(cursorRef.current.x, targetRef.current.x, 0.15);
      cursorRef.current.y = lerp(cursorRef.current.y, targetRef.current.y, 0.15);
      eyeCurrRef.current.x = lerp(eyeCurrRef.current.x, eyeTargetRef.current.x, 0.08);
      eyeCurrRef.current.y = lerp(eyeCurrRef.current.y, eyeTargetRef.current.y, 0.08);
      setCursorPos({x:cursorRef.current.x, y:cursorRef.current.y});
      setEyeOffset({x:eyeCurrRef.current.x, y:eyeCurrRef.current.y});
      
      // Decay trail
      setTrail(prev => prev.map(p => ({...p, opacity: p.opacity - 0.02})).filter(p => p.opacity > 0));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return ()=>{ 
      window.removeEventListener("mousemove",onMove); 
      window.removeEventListener("mousedown", onClick);
      cancelAnimationFrame(rafRef.current); 
    };
  },[addBurst]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section observer
  useEffect(()=>{
    const sections = ["hero","about","experience","skills","projects","contact"];
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          setActiveSection(e.target.id);
          setExpression(sectionExpressions[e.target.id]||"wave");
          if(e.target.id==="skills") setSkillsVisible(true);
        }
      });
    },{threshold:0.4});
    sections.forEach(id=>{ const el=document.getElementById(id); if(el) obs.observe(el); });
    return ()=>obs.disconnect();
  },[]);

  // Reveal observer
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
    },{threshold:0.15});
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.section-title").forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  },[]);

  const scrollToSection = useCallback(id=>{
    setIsTransitioning(true);
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setTimeout(() => setIsTransitioning(false), 800);
  }, []);

  const handleSend = useCallback(()=>{
    if(!formData.name||!formData.email) {
      alert("Please enter your name and email so I can get back to you! 🦇");
      return;
    }
    const subject = encodeURIComponent(`Portfolio Contact: Message from ${formData.name}`);
    const body = encodeURIComponent(`You have received a new message from your portfolio!\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.msg}`);
    
    // Outlook strips params on login redirect, so we use Gmail's web compose for reliable parameter preservation
    const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kotalashriyaa@gmail.com&su=${subject}&body=${body}`;
    window.open(composeUrl, '_blank');
    
    setFormData({name:"",email:"",msg:""});
  },[formData]);

  const navLinks = ["home","about","experience","skills","projects","contact"];

  return (
    <>
      <style>{STYLES}</style>
      <CurtainIntro key={curtainKey} theme={theme} />
      {/* Custom cursor */}
      <div className={`custom-cursor${cursorHovered?" hovered":""}`}
        style={{left:cursorPos.x,top:cursorPos.y}}/>
      {/* Navbar */}
      <nav className={`navbar${isScrolled?" scrolled":""}`}>
        <a className="navbar-logo" href="#hero" onClick={e=>{e.preventDefault();scrollToSection("hero");}}></a>
        <div className="navbar-links">
          {navLinks.map(link=>(
            <a key={link} href={`#${link==="home"?"hero":link}`}
              id={`nav-${link}`}
              className={`nav-link${activeSection===(link==="home"?"hero":link)?" active":""}`}
              onClick={e=>{e.preventDefault();scrollToSection(link==="home"?"hero":link);}}>
              {link.toUpperCase()}
            </a>
          ))}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            <div className="theme-icon-wrap" style={{ transform: theme === 'dark' ? 'rotate(360deg)' : 'rotate(0)' }}>
              {theme === "dark" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>
      {/* Character */}
      <Character expression={expression} eyeOffset={eyeOffset}/>
      {/* Sections */}
      <HeroSection scrollToSection={scrollToSection}/>
      <AboutSection/>
      <ExperienceSection/>
      <SkillsSection/>
      <ProjectsSection/>
      <ContactSection formData={formData} setFormData={setFormData} handleSend={handleSend}/>
      
      {/* Immersive Overlay Systems */}
      <CursorTrail particles={trail}/>
      {bursts.map(b => (
        <ComicBurst key={b.id} {...b} />
      ))}
      
      {/* Section Transition Impact Frame */}
      {isTransitioning && (
        <>
          <div style={{
            position: 'fixed', inset: '-10% -20%', zIndex: 100000,
            background: 'var(--ink)', pointerEvents: 'none',
            animation: 'ink-wipe-diagonal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards'
          }} />
          <div className="transition-word">
            {activeSection === "projects" ? "MISSION" : 
             activeSection === "about" ? "ORIGIN" : 
             activeSection === "experience" ? "HISTORY" :
             activeSection === "skills" ? "POWER" : "WHOOSH!"}
          </div>
        </>
      )}
    </>
  );
}
