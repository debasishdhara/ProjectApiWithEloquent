import { UserService } from '@service/UserService';
import { Request, Response } from 'express';

export class UserController {
  
  // Create a new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await UserService.create(userData); // Logic in UserService to save user
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  // Get a list of users
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAll(); // Logic to fetch all users
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  // Get a single user by ID
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id); // Fetch user by ID
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }

  // Update a user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await UserService.update(id, userData); // Logic to update user
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }

  // Delete a user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await UserService.delete(id); // Logic to delete user
      if (success) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
}
