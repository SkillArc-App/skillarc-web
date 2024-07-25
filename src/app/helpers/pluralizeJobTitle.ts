// Helper function that pluralizes the job title
export function pluralizeJobTitle(jobTitle: String) {
  // Check if the job title ends with "s" to see if it's already plural
  if (jobTitle.endsWith('s')) {
    return jobTitle
  } else {
    // If it's not plural, add an "s" to the end of the job title
    return jobTitle + 's'
  }
}
