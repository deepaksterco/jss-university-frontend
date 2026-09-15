export function capitalizeSlug(slug) {
    if (!slug) return '';
    
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  export function uppercaseSlug(slug){
    if (!slug) return '';
    
    return slug
      .split('-')
      .join(' ')
      .toUpperCase();
  }