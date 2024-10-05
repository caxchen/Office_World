README


DESCRIPTION
Welcome to the office of Heron Lissus, CEO and majority shareholder of Cicada Systems.  Cicada Systems is the primary producer of space exploration equipment both here in our Solar System, and our offworld colonies.  


ATTRIBUTIONS
Skybox: Daylight Box by Richy Mackro:  https://opengameart.org/content/sky-box-sunny-day
Heron model and keyboard png made by me


RUBRIC
1. Basic scene is working.  
a. There are at least 3 primary shapes.  The lights are made with cylinders, the walls are made with box geometries, and the holographic display is made of a plane.
b. The display has an animated data reading.  It is only visible from Heron's perspective.
c. There is a directional light source. Layout.js line 277
d. The camera is a perspective camera

2. At least one primary shape is textured.  The desk's orange virtual keyboard is a png texture I made in photoshop.

3. There is a custom model.  Heron is an obj file with an mtl file pointing to the textures.  I create her model with the addHeronLissus function in layout.js line 201.

4. The camera has orbit controls

5. At least 3 different light sources.  In layout.js, I have the addLights function on line 244.  In this function, I have an ambient light, several point lights in the CeilingLight prefab (prefabs.js line 397), and a directional light.

6. There is a skybox

7. At least 20 primary shapes.  I easily have over 20 primary shapes.  I think the desk alone has around 17 primary shapes or so.

Extras:
- Shadows
- Render to Texture: On the display, there is a display that tracks a satellite orbiting a gas giant.  Only visible from Heron's perspective
- Multiple Cameras:  Below the canvas, you can click the "Switch Perspectives" button to see things from Heron's perspective.