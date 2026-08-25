/**
 * Global Configuration for Links and Text
 * Update this file to change links across the entire site.
 */
const PROFILE_DATA = {
    // Personal Information
    name: "Rajesh Kodaganti",
    tagline: "I build <span style='color: var(--accent-purple);'>intelligent</span> systems.",

    // Links
    social: {
        github: "https://github.com/Unigalactix",
        linkedin: "https://www.linkedin.com/in/rajesh-kodaganti-323118215/",
        email: "mailto:rajeshkodaganti.work@gmail.com",
        learn: "https://learn.microsoft.com/en-us/users/rajeshkodaganti/"
    }
};

// Export for usage if using modules, but for now just global window access
window.PROFILE_DATA = PROFILE_DATA;
