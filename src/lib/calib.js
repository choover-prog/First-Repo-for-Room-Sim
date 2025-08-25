export function getMicLayout(name) {
  const layouts = {
    audyssey: [ [0,0], [0.3,0], [-0.3,0], [0,0.3], [0,-0.3], [0.3,0.3], [-0.3,0.3], [0.3,-0.3], [-0.3,-0.3] ],
    dirac: [ [0,0], [0.25,0], [-0.25,0], [0,0.25], [0,-0.25] ],
    custom: [ [0,0] ]
  };
  return layouts[name ? name.toLowerCase() : ''] || [];
}
