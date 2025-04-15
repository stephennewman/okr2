'use client' // Needed for hooks like useRouter and useEffect

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/useUserStore'
import { createClient } from '@/lib/supabase/client'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css'; // Import ReactFlow styles

// Placeholder initial nodes and edges
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Objective 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Key Result 1.1' } },
  { id: '3', position: { x: 200, y: 100 }, data: { label: 'Key Result 1.2' } },
];
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export default function DashboardPage() {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const supabase = createClient()

  // ReactFlow state
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  useEffect(() => {
    // Check if user is logged in on mount, redirect if not
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/') // Redirect to login page
      } else {
        // Ensure user state is up-to-date
        if (!user) {
          setUser(session.user);
        }
      }
    })

    // Listen for auth changes (e.g., logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       if (event === 'SIGNED_OUT') {
         setUser(null)
         router.push('/')
       } else if (event === 'SIGNED_IN') {
         setUser(session?.user ?? null)
       }
    });

    return () => {
      subscription?.unsubscribe()
    }

  }, [router, user, setUser, supabase])

  // Fetch OKR data effect (placeholder)
  useEffect(() => {
    if (user) {
      // TODO: Fetch OKRs from okrService and transform into nodes/edges
      console.log('User logged in, fetch OKRs here and update nodes/edges state.');
      // Example:
      // getOkrs().then(okrs => {
      //   const newNodes = okrs.map(okr => ({ id: okr.id, position: { x: Math.random() * 400, y: Math.random() * 400 }, data: { label: okr.content } }));
      //   setNodes(newNodes);
      //   // Logic to create edges based on relationships (e.g., objective_id)
      //   setEdges([]);
      // });
    }
  }, [user]); // Re-run when user state changes

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
    } else {
      setUser(null) // Clear user state immediately
      router.push('/') // Redirect to login page
    }
  }

  if (!user) {
    // Show loading state or null while checking auth/redirecting
    return <p>Loading authentication...</p>;
  }

  return (
    // Changed container to allow ReactFlow to fill space
    <div className="w-full h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h1 className="text-3xl font-bold">Dashboard</h1>
           <p>Welcome, {user.email}!</p>
         </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
        >
          Logout
        </button>
      </div>

      {/* Section for ReactFlow Canvas */}
      {/* Ensure the parent has a defined height (e.g., h-[calc(100vh-150px)] or flex-grow) */}
      <div className="flex-grow bg-card rounded-lg shadow mb-6 border border-border">
         {/* Set height for ReactFlow container */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView // Automatically zoom/pan to fit nodes
          className="bg-background" // Optional: Apply background color
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Placeholder for AI Feature - could be moved or integrated differently */}
      {/* <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">AI Feature</h2>
        <p>Placeholder for OpenAI integration.</p>
      </div> */}

    </div>
  )
} 