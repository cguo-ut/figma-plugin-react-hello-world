figma.showUI(__html__, { width: 500, height: 300, title: "Hello World" });

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection[0]
  figma.ui.postMessage({
    type: 'select-element',
    message: `"${selection.name}"#${selection.id}`
  })
  
})

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Created ${msg.count} Rectangles`,
    });
  }

  if (msg.type == 'parse-vh') {
    const parsedVH = {}
    const selection = figma.currentPage.selection[0]
    parseVH(selection, parsedVH)
    console.log("parsed VH:")
    console.log(parsedVH)
  }
  
  if (msg.type == 'cancel') {
    figma.closePlugin();
  }
};

function parseVH(root: BaseNode, parsedVH: object) {
  parsedVH['id'] = root.id
  parsedVH['parent'] = root.parent.id
  parsedVH['name'] = root.name
  if ((<DocumentNode|PageNode>root).children) {
    const parent = <DocumentNode|PageNode>root
    parsedVH['children'] = []
    for (const page of parent.children) {
      const child = {}
      parsedVH['children'].push(child)
      parseVH(page, child)
    }
  } else {
    const scene = <SceneNode>root
    parsedVH['x'] = scene.x
    parsedVH['y'] = scene.y
    parsedVH['height'] = scene.height  
    parsedVH['width'] = scene.width
    parsedVH['maxHeight'] = scene.maxHeight  
    parsedVH['maxWidth'] = scene.maxWidth
    parsedVH['minHeight'] = scene.minHeight
    parsedVH['minWidth'] = scene.minWidth
    parsedVH['type'] = scene.type
    parsedVH['visible'] = scene.visible
  }
}
