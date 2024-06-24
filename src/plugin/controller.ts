figma.showUI(__html__, { width: 500, height: 300, title: "Hello World" });

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection[0]
  figma.ui.postMessage({
    type: 'select-element',
    message: `"${selection.name}"#${selection.id}`
  })
  
})

figma.ui.onmessage = async (msg) => {
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
    if (selection.exportAsync) {
      console.log("Base 64 Image:")
      const b64str: string  = await exportBase64Img(selection)
      console.log(b64str)
    }
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
    populateUIProperties(scene, parsedVH)


  }
}

async function exportBase64Img(selectedNode: SceneNode): Promise<string> {
  const imgBytes: Uint8Array = await selectedNode.exportAsync({
    format: 'JPG', 
    constraint: { type: 'SCALE', value: 1 }
  })

  const base64Content = figma.base64Encode(imgBytes)
  return `data:image/jpeg;base64,${base64Content}`
}

function populateUIProperties(scene: SceneNode, parsedVH: object) {
  // PROPERTIES
  // bottomLeftRadius, bottomRightRadius, characters, clipsContent, constrainProportions, constraints, cornerRadius, description, fills, 
  // fontName, fontSize, fontWeight, height, isMask, opacity, overflowDirection, overlayBackground, overlayBackgroundInteraction, overlayPositionType, 
  // rotation, textDecoration, topLeftRadius, topRightRadius, type, visible, width, x, y
  if ((<ComponentNode>scene).bottomLeftRadius) { parsedVH['bottomLeftRadius'] = (<ComponentNode>scene).bottomLeftRadius; }
  if ((<ComponentNode>scene).bottomRightRadius) { parsedVH['bottomRightRadius'] = (<ComponentNode>scene).bottomRightRadius; }
  if ((<TextNode>scene).characters) { parsedVH['characters'] = (<TextNode>scene).characters; }
  if ((<ComponentNode>scene).clipsContent) { parsedVH['clipsContent'] = (<ComponentNode>scene).clipsContent; }
  if ((<ComponentNode>scene).constrainProportions) { parsedVH['constrainProportions'] = (<ComponentNode>scene).constrainProportions; }
  if ((<ComponentNode>scene).constraints) { parsedVH['constraints'] = (<ComponentNode>scene).constraints; }
  if ((<ComponentNode>scene).cornerRadius) { parsedVH['cornerRadius'] = (<ComponentNode>scene).cornerRadius; }
  if ((<ComponentNode>scene).description) { parsedVH['description'] = (<ComponentNode>scene).description; }
  if ((<ComponentNode>scene).fills) { parsedVH['fills'] = (<ComponentNode>scene).fills; }
  if ((<TextNode>scene).fontName) { parsedVH['fontName'] = (<TextNode>scene).fontName; }
  if ((<TextNode>scene).fontSize) { parsedVH['fontSize'] = (<TextNode>scene).fontSize; }
  if ((<TextNode>scene).fontWeight) { parsedVH['fontWeight'] = (<TextNode>scene).fontWeight; }
  if ((<ComponentNode>scene).height) { parsedVH['height'] = (<ComponentNode>scene).height; }
  if ((<ComponentNode>scene).isMask) { parsedVH['isMask'] = (<ComponentNode>scene).isMask; }
  if ((<ComponentNode>scene).opacity) { parsedVH['opacity'] = (<ComponentNode>scene).opacity; }
  if ((<ComponentNode>scene).overflowDirection) { parsedVH['overflowDirection'] = (<ComponentNode>scene).overflowDirection; }
  if ((<ComponentNode>scene).overlayBackground) { parsedVH['overlayBackground'] = (<ComponentNode>scene).overlayBackground; }
  if ((<ComponentNode>scene).overlayBackgroundInteraction) { parsedVH['overlayBackgroundInteraction'] = (<ComponentNode>scene).overlayBackgroundInteraction; }
  if ((<ComponentNode>scene).overlayPositionType) { parsedVH['overlayPositionType'] = (<ComponentNode>scene).overlayPositionType; }
  if ((<ComponentNode>scene).rotation) { parsedVH['rotation'] = (<ComponentNode>scene).rotation; }
  if ((<TextNode>scene).textDecoration) { parsedVH['textDecoration'] = (<TextNode>scene).textDecoration; }
  if ((<ComponentNode>scene).topLeftRadius) { parsedVH['topLeftRadius'] = (<ComponentNode>scene).topLeftRadius; }
  if ((<ComponentNode>scene).topRightRadius) { parsedVH['topRightRadius'] = (<ComponentNode>scene).topRightRadius; }
  if ((<ComponentNode>scene).type) { parsedVH['type'] = (<ComponentNode>scene).type; }
  if ((<ComponentNode>scene).visible) { parsedVH['visible'] = (<ComponentNode>scene).visible; }
  if ((<ComponentNode>scene).width) { parsedVH['height'] = (<ComponentNode>scene).width; }
  if ((<ComponentNode>scene).x) { parsedVH['x'] = (<ComponentNode>scene).x; }
  if ((<ComponentNode>scene).y) { parsedVH['y'] = (<ComponentNode>scene).y; }

  //MAYBE:
  // auto-layout: 
  // counterAxisAlignContent, counterAxisAlignItems, counterAxisSizingMode, counterAxisSpacing, itemReverseZIndex, itemSpacing, 
  // layoutAlign, layoutGrow, layoutMode, layoutPoisitioning, layoutSizingHorizontal, layoutSizingVertical, layoutWrap, 
  // primaryAxisAlignItems, primaryAxisSizingMode, strokesIncludedInLayout

  // stroke: 
  // strokeAlign, strokeBottomWeight, strokeCap, strokeGeometry, strokeJoin, strokeLeftWeight, strokeMiterLimit, strokeRightWeight, 
  // strokeTopWeight, strokeWeight, strokes, maxHeight, maxWidth, minHeight, minWidth,  paddingBottom, paddingLeft, 
  // paddingRight, paddingTop, 

  // absoluteBoundingBox, absoluteTransfrom, blendMode, relativeTransform, 
    
  // LAST CASE SCENARIO: getCSSAsync(), getMeasurements(), toString()
}