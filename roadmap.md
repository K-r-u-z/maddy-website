# Cake Pops by Maddy - Development Roadmap

## File Structure
maddy-website/cake-pops-by-maddy

## Overview
This project is a clean, modern, and responsive website for the "Cake Pops by Maddy" business. It features an About Me section, Menu, How to Order instructions, FAQ, and Contact Form.

---

## Goals
1. Showcase Maddy’s cake pop offerings and brand story.
2. Provide clear, user-friendly ordering instructions.
3. Streamline contact and inquiry handling.
4. Use a modern tech stack for scalability and ease of maintenance.

---

## Tech Stack
- **Frontend:** React, Next.js
- **Hosting:** Vercel
- **Database:** MongoDB Atlas
- **Rich Text Editor:** React Quill
- **Email Service:** Resend

---

## Roadmap

### Phase 1: Project Setup
1. Initialize a new Next.js project.
2. Set up hosting on Vercel.
3. Configure MongoDB Atlas for database integration.
4. Install required dependencies:
   - `react`
   - `next`
   - `mongodb`
   - `react-quill`
   - `resend`
5. Create a shared design system for reusable components (buttons, cards, etc.).

---

### Phase 2: Core Pages & Features
#### **Hero Section**
- Design and implement a visually appealing hero section.
- Add a business tagline and call-to-action buttons.

#### **About Me**
- Create a section introducing Maddy with text and images.
- Fetch content dynamically using MongoDB Atlas.

#### **Menu**
- Design a menu layout using cards or grids.
- Fetch menu items and images from MongoDB Atlas.
- Add a filter/search functionality (optional).

#### **How to Order**
- Display step-by-step ordering instructions.
- Include links to order forms or methods (e.g., contact form, email).

#### **FAQ**
- Implement an accordion layout for questions and answers.
- Fetch FAQ data from MongoDB Atlas.

#### **Contact Form**
- Build a contact form with validation.
- Send inquiries via Resend API.
- Store inquiries in MongoDB Atlas for record-keeping.

---

### Phase 3: Additional Features
1. Add content management for Maddy (admin):
   - Use React Quill for creating/editing menu items and FAQs.
   - Create a simple admin interface.
2. Optimize the site for SEO using Next.js features like metadata and server-side rendering.
3. Add a loading spinner or skeletons for improved UX during data fetches.

---

### Phase 4: Testing & Deployment
1. Test the application for responsiveness and browser compatibility.
2. Write unit and integration tests.
3. Optimize site performance using Next.js analytics.
4. Deploy the website on Vercel.

---

### Future Enhancements
- Add a gallery section for showcasing custom cake pops.
- Introduce user accounts for managing orders.
- Implement analytics to track user behavior and feedback.

---

## Timeline
- **Phase 1:** 1 week
- **Phase 2:** 2 weeks
- **Phase 3:** 1 week
- **Phase 4:** 1 week

---

## Author
Developed for Cake Pops by Maddy by Kruz.

---
