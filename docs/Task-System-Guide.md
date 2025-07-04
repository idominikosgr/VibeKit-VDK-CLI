# 🎯 Task System Guide

The VibeKit VDK CLI task system provides 51+ specialized workflows and guidelines for AI assistants to handle specific development activities with expertise and consistency.

## Overview

Tasks are specialized rule files that define AI behavior for particular development activities. Each task provides:

- **Specific workflows** for common development activities
- **Best practices** and methodologies for each task type
- **Context-aware guidance** based on project patterns
- **Quality standards** and validation criteria
- **Integration patterns** with other tools and systems

## Task Categories

### 🔄 Session Management
**AI-Session-Handoff.mdc** - Protocols for maintaining continuity between development sessions
- Context preservation across sessions
- Decision history documentation
- Progress tracking and milestone recording
- Team member knowledge transfer

### 🔍 Code Quality & Analysis
**Code-Quality-Review.mdc** - Comprehensive code quality assessment
- Static analysis patterns
- Code complexity evaluation
- Security vulnerability detection
- Performance bottleneck identification

**Analyze-Dependencies.mdc** - Dependency analysis and management
- Dependency tree analysis
- Version conflict detection
- Security vulnerability scanning
- Update impact assessment

**Analyze-Logs.mdc** - Log analysis and troubleshooting
- Error pattern detection
- Performance metrics extraction
- Security event identification
- Operational insights generation

### 🛠️ Development Operations
**Debugging-Assistant.mdc** - Systematic debugging approaches
- Root cause analysis methodology
- Step-by-step debugging workflows
- Tool integration for debugging
- Error reproduction strategies

**Refactor-Code.mdc** - Code refactoring best practices
- Refactoring strategy planning
- Safety checks and validation
- Performance impact assessment
- Documentation updates

**Performance-Optimization.mdc** - Performance improvement strategies
- Profiling and measurement techniques
- Optimization opportunity identification
- Implementation guidance
- Performance regression prevention

### 🏗️ Architecture & Design
**API-Design.mdc** - API development patterns
- RESTful API design principles
- GraphQL schema design
- API versioning strategies
- Documentation generation

**API-Endpoints.mdc** - Endpoint implementation guidance
- Route structure organization
- Request/response validation
- Error handling patterns
- Rate limiting and security

**Database-Design.mdc** - Database schema and optimization
- Normalization strategies
- Index optimization
- Query performance tuning
- Migration management

### 📚 Documentation
**API-Docs.mdc** - API documentation generation
- OpenAPI/Swagger specification
- Code comment standards
- Example generation
- Documentation maintenance

**Write-Documentation.mdc** - General documentation standards
- Technical writing guidelines
- Documentation structure
- Code example integration
- Version control for docs

### 🧪 Testing & Validation
**Write-Tests.mdc** - Testing strategy and implementation
- Test-driven development patterns
- Unit testing best practices
- Integration testing approaches
- Test automation setup

**Test-API.mdc** - API testing methodologies
- Endpoint testing strategies
- Mock data generation
- Contract testing
- Performance testing

### ♿ Accessibility & Compliance
**Accessibility-Review.mdc** - UI/UX accessibility compliance
- WCAG compliance checking
- Screen reader optimization
- Keyboard navigation testing
- Color contrast validation

### 📊 Data & Analytics
**Analyze-Data.mdc** - Data analysis workflows
- Data quality assessment
- Pattern recognition
- Statistical analysis
- Visualization recommendations

**Data-Migration.mdc** - Database migration strategies
- Migration planning
- Data integrity validation
- Rollback procedures
- Performance considerations

### 🔐 Security
**Security-Review.mdc** - Security assessment and hardening
- Vulnerability assessment
- Authentication/authorization review
- Data protection compliance
- Security best practices

### ⚡ DevOps & Deployment
**Deploy-Application.mdc** - Deployment strategies and automation
- CI/CD pipeline design
- Environment management
- Rollback strategies
- Monitoring setup

**Container-Management.mdc** - Docker and Kubernetes patterns
- Container optimization
- Orchestration strategies
- Resource management
- Security hardening

## Task Activation

### Automatic Activation
Tasks activate automatically based on:
- **File context**: Working with test files triggers testing tasks
- **Project patterns**: API projects activate API-related tasks
- **Error patterns**: Debug tasks activate when errors are detected

### Semantic Activation
AI assistants choose appropriate tasks based on:
- **User intent**: "Help me debug this issue" → `Debugging-Assistant.mdc`
- **Context clues**: Working with database files → `Database-Design.mdc`
- **Project phase**: Initial setup → `Project-Setup.mdc`

### Explicit Activation
Direct task invocation:
```
@tasks/Code-Quality-Review.mdc - please review this component
@tasks/API-Design.mdc - help design this REST endpoint
@tasks/Performance-Optimization.mdc - optimize this function
```

## Task Integration Patterns

### Memory Integration
Tasks work with memory management for:
- **Context preservation**: Remembering architectural decisions
- **Progress tracking**: Maintaining task completion status
- **Learning from feedback**: Improving task execution over time

### MCP Server Integration
Tasks leverage MCP servers for:
- **Code analysis**: Quality metrics and insights
- **Documentation**: Automated documentation generation
- **Testing**: Test automation and validation

### Cross-Task Workflows
Tasks can chain together for complex workflows:
1. `Analyze-Dependencies.mdc` → identifies outdated packages
2. `Security-Review.mdc` → checks for vulnerabilities
3. `Update-Dependencies.mdc` → performs safe updates
4. `Write-Tests.mdc` → validates updated functionality

## Task Customization

### Project-Specific Tasks
Create custom tasks for your project's unique needs:

```yaml
---
description: "Custom deployment workflow for microservices architecture"
globs: "**/deploy/**,**/k8s/**"
alwaysApply: false
version: "1.0.0"
tags: ["deployment", "microservices", "kubernetes"]
---

# Microservices Deployment Task

## Deployment Checklist
- [ ] Service health checks configured
- [ ] Inter-service communication tested
- [ ] Database migrations applied
- [ ] Monitoring and alerting enabled
```

### Team-Specific Guidelines
Adapt tasks to your team's practices:

```markdown
## Code Review Process
1. Run automated quality checks
2. Verify test coverage > 80%
3. Check for breaking changes
4. Review security implications
5. Validate documentation updates
```

## Advanced Task Features

### Dynamic Context Awareness
Tasks adapt based on:
- **Project technology stack**: React tasks for React projects
- **Development phase**: Different guidance for MVP vs production
- **Team experience level**: Beginner vs expert guidance
- **Previous decisions**: Consistency with past architectural choices

### Quality Metrics Integration
Tasks track and improve based on:
- **Success rates**: How often tasks achieve desired outcomes
- **User feedback**: Developer satisfaction with task guidance
- **Code quality impact**: Measurable improvements in code quality
- **Time savings**: Efficiency gains from task automation

### Continuous Learning
Tasks evolve through:
- **Community contributions**: Shared improvements and patterns
- **Project-specific learning**: Adaptation to project patterns
- **Feedback integration**: Incorporating user corrections
- **Best practice updates**: Staying current with industry standards

## Task Development Guidelines

### Creating New Tasks

1. **Identify the need**: Specific, recurring development activity
2. **Define scope**: Clear boundaries and objectives
3. **Research best practices**: Industry standards and patterns
4. **Write clear guidance**: Step-by-step workflows
5. **Include examples**: Real-world implementations
6. **Test effectiveness**: Validate with actual development scenarios

### Task Quality Standards

- **Specificity**: Concrete, actionable guidance
- **Completeness**: Cover entire workflow end-to-end
- **Accuracy**: Technically correct and up-to-date
- **Usability**: Easy to follow and implement
- **Integration**: Works well with other tasks and tools

### Community Contribution

Share your task improvements:
1. **Test thoroughly**: Validate in real projects
2. **Document clearly**: Include examples and rationale
3. **Follow standards**: Use consistent format and style
4. **Provide context**: Explain when and why to use the task
5. **Support migration**: Help others adopt the task

## Future Enhancements

### Planned Task Additions
- **AI Model Integration**: Tasks for working with ML/AI models
- **Blockchain Development**: Smart contract and DApp patterns
- **IoT Development**: Embedded system and device integration
- **Accessibility Automation**: Automated accessibility testing
- **Performance Monitoring**: Real-time performance analysis

### Advanced Capabilities
- **Task Orchestration**: Complex multi-task workflows
- **Conditional Logic**: Smart task selection based on context
- **Learning Integration**: AI-powered task improvement
- **Team Collaboration**: Multi-developer task coordination

---

The task system transforms AI assistants from generic helpers into specialized experts, providing deep knowledge and consistent guidance for every aspect of the development lifecycle. 