// Simple script to create a SUPER_ADMIN user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function createSuperAdmin() {
  try {
    console.log('Creating SUPER_ADMIN account...');
    
    // Get admin details from user input
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const mobile = await question('Enter admin mobile number: ');
    const address = await question('Enter admin address: ');
    const password = await question('Enter admin password: ');
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        address,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });
    
    console.log('SUPER_ADMIN created successfully!');
    console.log(`Admin ID: ${admin.id}`);
    console.log(`Admin Email: ${admin.email}`);
    
  } catch (error) {
    console.error('Error creating SUPER_ADMIN:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Helper function to prompt for input
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

// Run the function
createSuperAdmin();
