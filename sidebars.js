/**
 * Sidebar configuration for Physical AI & Humanoid Robotics Textbook
 * Simplified to use only existing files
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main textbook sidebar - organized by modules
  textbookSidebar: [
    // Introduction Section
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },

    // Module 1: ROS 2 Foundations
    {
      type: 'category',
      label: 'Module 1: ROS 2 Foundations',
      collapsed: false,
      items: [
        'ros2-fundamentals/ros2-fundamentals-intro',
      ],
    },

    // Module 2: Simulation & Digital Twins
    {
      type: 'category',
      label: 'Module 2: Simulation & Digital Twins',
      collapsed: true,
      items: [
        'robot-simulation/robot-simulation-intro',
      ],
    },

    // Module 3: NVIDIA Isaac Platform
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac Platform',
      collapsed: true,
      items: [
        'nvidia-isaac-platform/nvidia-isaac-platform-intro',
      ],
    },

    // Module 5: Vision-Language-Action (VLA)
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      collapsed: true,
      items: [
        'conversational-robotics-vla/conversational-robotics-vla-intro',
      ],
    },

    // Appendix
    {
      type: 'category',
      label: 'Appendix',
      collapsed: true,
      items: [
        'appendix/book-plan',
      ],
    },
  ],
};

module.exports = sidebars;
