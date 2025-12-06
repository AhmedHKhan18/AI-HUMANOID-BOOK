<!--
Sync Impact Report:
Version change: None -> 1.0.0
List of modified principles:
  - Technical Accuracy (Added)
  - Educational Clarity (Added)
  - Practical Reproducibility (Added)
  - Engineering Rigor (Added)
Added sections:
  - Key Standards
  - Constraints
Removed sections:
  - PRINCIPLE_5, PRINCIPLE_6
Templates requiring updates:
  - .specify/templates/plan-template.md (⚠ pending)
  - .specify/templates/spec-template.md (⚠ pending)
  - .specify/templates/tasks-template.md (⚠ pending)
  - .specify/templates/commands/sp.constitution.md (⚠ pending)
Follow-up TODOs: None
-->
# AI/Spec-Driven Book Creation — Physical AI & Humanoid Robotics Constitution

## Core Principles

### I. Technical Accuracy
Technical Accuracy across robotics, AI, and simulation frameworks (ROS 2, Gazebo, Isaac). All technical claims MUST reference official documentation (ROS 2, NVIDIA Isaac, Gazebo, Unity). No hallucinated APIs, commands, or hardware specs. All references to NVIDIA Isaac, ROS 2, Gazebo MUST match official functionality. No claims about hardware unless they match vendor specifications.

### II. Educational Clarity
Educational Clarity for students and developers (intermediate CS/AI background). When describing robotics concepts (URDF, VSLAM, kinematics), provide simplified + formal definitions. Tone MUST be authoritative but beginner-friendly; avoid over-complex jargon unless explained. When introducing new concepts (e.g., VSLAM, Kinematics, Nav2), include: Definition, Real-world analogy, Example command/code, and Integration notes. Flesch-Kincaid grade target: 8–12.

### III. Practical Reproducibility
Practical Reproducibility (all tools, setups, and workflows MUST be replicable). All workflows (simulation, navigation, perception, VLA) MUST be fully reproducible by students. Code MUST compile and reflect real ROS 2 / Isaac / Python usage. Must include step-by-step guides for simulations, hardware setup, and project execution.

### IV. Engineering Rigor
Engineering Rigor (hardware specs, simulations, and algorithms MUST be validated). Book accurately explains the full pipeline: ROS 2 → Gazebo → Unity → Isaac → VLA → Humanoid Deployment. The book successfully builds and deploys via Docusaurus without build errors.

## Key Standards

- All technical claims MUST reference official documentation (ROS 2, NVIDIA Isaac, Gazebo, Unity)
- When describing robotics concepts (URDF, VSLAM, kinematics), provide simplified + formal definitions
- Writing Format: modular sections optimized for Docusaurus (MDX-friendly)
- Tone: authoritative but beginner-friendly; avoid over-complex jargon unless explained
- MUST include step-by-step guides for simulations, hardware setup, and project execution

## Constraints

- Book structure aligned with the course: 13–15 chapters mirroring modules & weekly breakdown
- Required elements: diagrams, code snippets, architecture explanations, hardware lists
- MUST include Capstone chapter: “The Autonomous Humanoid”
- Deployment-ready format: Markdown/MDX only (no proprietary formatting)
- Content MUST be optimized for GitHub Pages build (no oversized images, stable links)

## Governance
This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All PRs/reviews MUST verify compliance. Complexity MUST be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04