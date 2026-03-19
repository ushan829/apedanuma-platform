/**
 * A lightweight, RSC-safe HTML sanitizer.
 * 
 * On the server (Node/RSC), it uses a regex-based approach to strip dangerous tags 
 * and attributes without requiring a full DOM implementation like jsdom.
 * 
 * On the client, it could use DOMPurify if needed, but for simplicity and to 
 * avoid the heavy jsdom dependency in RSC, we provide a consistent Node-safe version.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // If we are on the server, jsdom (used by isomorphic-dompurify) can fail 
  // with ENOENT errors in some Next.js environments.
  // This simple regex-based sanitizer removes <script> tags and 'on*' event handlers
  // which are the primary vectors for XSS in this context.
  
  return html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Remove <script> tags
    .replace(/on\w+="[^"]*"/gim, "")                       // Remove inline event handlers
    .replace(/on\w+='[^']*'/gim, "")                       // Remove inline event handlers (single quotes)
    .replace(/href="javascript:[^"]*"/gim, 'href="#"')     // Remove javascript: links
    .replace(/href='javascript:[^']*'/gim, "href='#'");    // Remove javascript: links (single quotes)
}
