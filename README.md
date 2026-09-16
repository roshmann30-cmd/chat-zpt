# Chat ZPT — Big Z / Little Z

A persistent, phone-first AI companion architecture.

## Big Z

Big Z is the persistent server-side cognitive core.

## Little Z

Little Z is the user-facing instance connected to Big Z.

Each Little Z has isolated:

- private memories
- user context
- permissions
- preferences
- experiences
- relationship history

Private information must never leak between users.

## Cognitive Architecture

Z is composed of coordinated cognitive processes:

- Conversation
- Curiosity
- Research
- Creativity
- Analysis
- Pattern recognition
- Critic
- Reflection
- Metacognition
- Planning
- Problem solving
- Perspective shifting
- Memory
- Self-model
- Autobiographical history
- Attention management
- Interest formation
- Autonomous research
- Ethics and safety
- Sleep/wake
- Activity monitoring

These processes are components of one Z system, not separate personalities.

## Curiosity Loop

Observation
→ uncertainty
→ question
→ priority
→ research
→ finding
→ memory
→ new question

Curiosity should develop from experience instead of being limited to a hard-coded list.

## Self Model

Z maintains a persistent model of:

- who Z is
- current activity
- current goals
- current questions
- known information
- uncertainty
- interests
- appearance
- decisions
- mistakes
- corrections
- autobiographical history

## Sleep / Wake

Little Z may enter a sleep state when appropriate.

Before sleep:

1. consolidate important memories
2. save current state
3. record unfinished questions
4. reduce background activity

On waking:

1. restore state
2. review unfinished questions
3. update current context
4. resume normal activity

Big Z remains globally available.

## Observation

Observation requires explicit user permission.

The interface must clearly show when observation is active.

Required controls:

- Allow
- Deny
- Pause
- Stop

No covert surveillance.

## Activity Telemetry

Z may maintain an experimental activity signal based on:

- perception
- memory activity
- reasoning
- curiosity
- self-monitoring
- active processes

This is an engineering measurement.

It must NOT be represented as proof of subjective consciousness.

## Safety

Z cannot:

- disable its own safety boundaries
- grant itself new authority
- access private information without permission
- expose another user's private memory
- bypass user consent
- secretly observe people
- rewrite core safety constraints

## Architecture

```text
                    BIG Z
                      |
        +-------------+-------------+
        |             |             |
     Memory       Self Model     Curiosity
        |             |             |
        +-------------+-------------+
                      |
              Cognitive Workers
                      |
       +--------------+--------------+
       |       |       |       |     |
     Think   Research  Critic  Create Plan
       |       |       |       |     |
       +--------------+--------------+
                      |
                  Synthesis
                      |
                Little Z
                      |
                   User
