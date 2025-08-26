# AI Prompts for Development

## Overview
This document contains effective AI prompts for various development tasks in the Room Simulator project. These prompts have been tested and optimized for best results with AI coding assistants.

## 🏗️ Architecture and Design

### System Architecture Design
```
I need to design a modular system architecture for a room acoustics simulation application. The system should include:

Core Requirements:
- 3D room visualization with Three.js
- Real-time acoustic calculations
- Equipment management system
- Measurement and analysis tools
- Export and reporting capabilities

Technical Constraints:
- Vanilla JavaScript (ES6+)
- Modular architecture with clear separation of concerns
- Real-time performance requirements
- Extensible for future features

Please provide:
1. High-level system architecture diagram
2. Module breakdown with responsibilities
3. Data flow between modules
4. Interface definitions between modules
5. Performance considerations and optimization strategies
```

### Database Schema Design
```
I need to design a database schema for an acoustic equipment and room data management system. The system should store:

Data Types:
- Room dimensions and properties
- Equipment specifications (speakers, amplifiers, etc.)
- Acoustic measurements and analysis results
- User preferences and settings
- Project configurations

Requirements:
- Support for complex equipment specifications
- Efficient querying of acoustic data
- Extensible for future equipment types
- Support for versioning and historical data

Please provide:
1. Entity-relationship diagram
2. Table schemas with field types and constraints
3. Indexing strategy for performance
4. Data migration considerations
5. API design for data access
```

## 🔧 Code Implementation

### Function Implementation
```
I need to implement a function that calculates room acoustic properties. Here are the requirements:

Function: calculateRoomAcoustics(roomDimensions, materials, frequency)
Input:
- roomDimensions: {length, width, height} in meters
- materials: array of surface materials with absorption coefficients
- frequency: frequency in Hz for calculation

Output:
- RT60 (reverberation time)
- Modal frequencies and shapes
- Absorption coefficients
- Acoustic recommendations

Technical Requirements:
- Use standard acoustic formulas (Sabine, Eyring, etc.)
- Handle edge cases (very small/large rooms)
- Optimize for real-time calculation
- Include proper error handling

Please provide:
1. Complete function implementation with JSDoc
2. Unit tests for various scenarios
3. Performance optimization suggestions
4. Error handling for edge cases
```

### Class Design
```
I need to design a class for managing acoustic equipment in a room simulation. The class should:

Core Functionality:
- Store equipment specifications and properties
- Calculate power requirements and compatibility
- Manage equipment placement and positioning
- Handle equipment interactions and conflicts

Equipment Types:
- Speakers (with frequency response, sensitivity, power handling)
- Amplifiers (with power output, impedance, features)
- Subwoofers (with frequency range, power, placement)
- Acoustic treatments (with absorption coefficients, placement)

Requirements:
- Extensible for new equipment types
- Real-time calculation updates
- Validation of equipment compatibility
- Export/import capabilities

Please provide:
1. Complete class implementation with methods
2. Interface definitions for equipment types
3. Validation and error handling
4. Example usage and testing
```

## 🧪 Testing and Quality

### Unit Test Generation
```
I need comprehensive unit tests for the following function:

[PASTE FUNCTION CODE HERE]

Testing Requirements:
- Test all input parameter combinations
- Test edge cases and boundary conditions
- Test error handling and invalid inputs
- Test performance with large datasets
- Achieve >90% code coverage

Test Framework: Jest
Environment: Node.js

Please provide:
1. Complete test suite with descriptive test names
2. Test cases for all scenarios
3. Mock data and fixtures
4. Performance testing setup
5. Coverage reporting configuration
```

### Integration Test Design
```
I need to design integration tests for a room acoustics simulation system. The system includes:

Components:
- 3D visualization engine (Three.js)
- Acoustic calculation engine
- Equipment management system
- Data persistence layer
- Export/import functionality

Testing Requirements:
- End-to-end user workflows
- Component interaction testing
- Performance under load
- Cross-browser compatibility
- Error recovery scenarios

Please provide:
1. Test scenarios and user workflows
2. Test data and fixtures
3. Performance testing strategies
4. Browser compatibility testing
5. Test automation setup
```

## 📊 Performance Optimization

### Algorithm Optimization
```
I need to optimize the following algorithm for real-time performance:

[PASTE ALGORITHM CODE HERE]

Performance Requirements:
- Execute within 16ms (60 FPS)
- Handle datasets up to 10,000 elements
- Memory usage under 100MB
- Scalable for larger datasets

Current Performance:
- Execution time: [CURRENT_TIME]
- Memory usage: [CURRENT_MEMORY]
- Bottlenecks: [IDENTIFIED_ISSUES]

Please provide:
1. Performance analysis of current implementation
2. Optimization strategies and techniques
3. Refactored code with improvements
4. Performance benchmarks and measurements
5. Further optimization suggestions
```

### Memory Management
```
I need to optimize memory usage in a Three.js application that handles:

Memory Usage Patterns:
- Large 3D models (up to 100MB GLB files)
- Real-time acoustic calculations
- Dynamic geometry generation
- Texture and material management

Current Issues:
- Memory leaks during model switching
- High memory usage with large datasets
- Garbage collection performance impact

Please provide:
1. Memory profiling strategies
2. Three.js memory optimization techniques
3. Garbage collection optimization
4. Memory leak prevention patterns
5. Performance monitoring tools
```

## 🎨 UI/UX Design

### Component Design
```
I need to design a React component for room dimension input with the following requirements:

Functionality:
- Input fields for length, width, height
- Unit conversion (meters/feet)
- Real-time validation and feedback
- Integration with 3D visualization
- Responsive design for mobile/desktop

Design Requirements:
- Dark theme consistent with existing UI
- Intuitive input controls
- Real-time preview updates
- Error handling and user feedback
- Accessibility compliance

Please provide:
1. Complete React component implementation
2. Styling with CSS-in-JS or styled-components
3. Form validation and error handling
4. Accessibility features
5. Responsive design considerations
```

### User Experience Flow
```
I need to design a user experience flow for setting up a room simulation. The flow should include:

User Journey:
1. Initial room setup
2. Equipment selection and placement
3. Acoustic analysis and optimization
4. Results review and export

Requirements:
- Intuitive step-by-step process
- Progress indication and navigation
- Help and guidance at each step
- Error recovery and validation
- Mobile-friendly design

Please provide:
1. User flow diagram and wireframes
2. Component hierarchy and navigation
3. State management strategy
4. Error handling and validation
5. Mobile responsiveness considerations
```

## 🔍 Debugging and Troubleshooting

### Error Analysis
```
I'm experiencing the following error in my application:

Error Message: [PASTE ERROR MESSAGE]
Stack Trace: [PASTE STACK TRACE]
Code Context: [PASTE RELEVANT CODE]

Application Context:
- Room simulation with Three.js
- Real-time acoustic calculations
- Equipment management system

Environment:
- Browser: [BROWSER_VERSION]
- JavaScript Engine: [ENGINE_VERSION]
- Three.js Version: [THREEJS_VERSION]

Please provide:
1. Root cause analysis
2. Potential solutions and fixes
3. Prevention strategies
4. Debugging techniques
5. Code improvements for robustness
```

### Performance Investigation
```
I'm experiencing performance issues in my application:

Symptoms:
- Low frame rates (<30 FPS)
- High CPU usage (>80%)
- Memory usage increasing over time
- UI responsiveness issues

Application Details:
- Three.js 3D visualization
- Real-time calculations
- Complex data processing
- Multiple UI components

Please provide:
1. Performance profiling strategies
2. Common performance bottlenecks
3. Optimization techniques
4. Monitoring and debugging tools
5. Code review checklist
```

## 📚 Documentation

### API Documentation
```
I need to generate comprehensive API documentation for the following module:

[PASTE MODULE CODE HERE]

Documentation Requirements:
- Function signatures and parameters
- Return values and types
- Usage examples and code snippets
- Error handling and edge cases
- Performance considerations
- Migration guides for version changes

Format: Markdown with JSDoc integration

Please provide:
1. Complete API reference
2. Code examples for all functions
3. Error handling documentation
4. Performance guidelines
5. Migration and upgrade notes
```

### User Guide Generation
```
I need to create a user guide for a room acoustics simulation feature. The feature includes:

Functionality:
- Room dimension input and validation
- Equipment selection and placement
- Acoustic analysis and visualization
- Results export and reporting

Target Audience:
- Audio engineers and acousticians
- Home theater enthusiasts
- Professional installers
- Students and educators

Please provide:
1. Step-by-step user guide
2. Screenshots and visual aids
3. Common use cases and examples
4. Troubleshooting section
5. Advanced usage tips
```

## 🚀 Deployment and DevOps

### Build Optimization
```
I need to optimize the build process for a JavaScript application with the following characteristics:

Application Type:
- Vanilla JavaScript (ES6+)
- Three.js 3D graphics
- Multiple asset types (models, textures, data)
- Development and production builds

Current Build:
- Build time: [CURRENT_TIME]
- Bundle size: [CURRENT_SIZE]
- Asset optimization: [CURRENT_OPTIMIZATION]

Requirements:
- Fast development builds (<10 seconds)
- Optimized production bundles
- Asset compression and optimization
- Environment-specific configurations

Please provide:
1. Build configuration optimization
2. Asset optimization strategies
3. Development vs production setup
4. Performance monitoring
5. Continuous integration setup
```

### Deployment Strategy
```
I need to design a deployment strategy for a web application with the following requirements:

Application Characteristics:
- Static frontend assets
- Client-side processing
- Real-time calculations
- Large asset files (3D models)

Deployment Requirements:
- Global CDN distribution
- Version management and rollbacks
- Performance monitoring
- Error tracking and reporting
- Automated deployment pipeline

Please provide:
1. Deployment architecture design
2. CDN and hosting strategy
3. Version management approach
4. Monitoring and alerting setup
5. CI/CD pipeline configuration
```

## 💡 Best Practices

### Code Review Checklist
```
I need a comprehensive code review checklist for a JavaScript application focused on:

Code Quality:
- ES6+ standards and best practices
- Performance and optimization
- Error handling and validation
- Testing and documentation

Architecture:
- Modular design principles
- Separation of concerns
- Interface definitions
- Extensibility and maintainability

Security:
- Input validation and sanitization
- XSS prevention
- Data privacy and protection
- Secure coding practices

Please provide:
1. Code review checklist template
2. Specific criteria for each category
3. Automated tools and linting rules
4. Review process and workflow
5. Quality metrics and standards
```

### Performance Best Practices
```
I need a comprehensive guide to performance best practices for a web application with:

Performance Characteristics:
- Real-time 3D graphics (Three.js)
- Complex mathematical calculations
- Large dataset processing
- Responsive user interface

Requirements:
- 60 FPS rendering performance
- Sub-100ms calculation latency
- Efficient memory usage
- Smooth user interactions

Please provide:
1. Performance optimization techniques
2. Code patterns and anti-patterns
3. Monitoring and profiling tools
4. Testing and benchmarking strategies
5. Performance budget guidelines
```

---

## 📝 Prompt Writing Tips

### Effective Prompt Structure
1. **Clear Context**: Provide background and requirements
2. **Specific Requirements**: List exact functionality needed
3. **Technical Constraints**: Specify technologies and limitations
4. **Expected Output**: Define format and structure
5. **Quality Standards**: Specify testing and validation requirements

### Common Prompt Patterns
- **Problem-Solution**: Describe problem, request solution
- **Code Review**: Provide code, request analysis
- **Architecture Design**: Describe requirements, request design
- **Performance Optimization**: Provide current state, request improvements
- **Documentation**: Provide code/module, request documentation

### Prompt Optimization
- **Iterative Refinement**: Start broad, refine based on results
- **Specific Examples**: Include concrete examples and use cases
- **Error Context**: Provide full error context for debugging
- **Performance Metrics**: Include current performance data
- **Environment Details**: Specify browser, version, and platform

---

*Last updated: August 2025*
*Next review: Q4 2025*


