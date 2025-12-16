# Interactive-B-zier-Curve-with-Physics-Sensor-Control

# Introduction
An interactive web application showing  Bezeir curve and the control points. 
The cursor helps in changing the control points and hence intercting with the curve.

# Math: Cubic Equation
Uses 4 control points P₀, P₁, P₂, P₃ to define the curve:
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
 Sample t from 0 to 1 (step 0.01) to draw smooth curve
 Tangents from derivative B (t), normalized and shown at 5 points along curve.

# Physics: Spring-Damping Motion
P₀, P₃: Fixed endpoints (like rope nailed to walls)
 P₁, P₂: Dynamic points with position, velocity, target

# How to Run
1. Open `index.html` in Chrome/Firefox/Edge
2. Move mouse over black canvas
3. Watch rope follow with springy motion + live tangents
