
// @ts-ignore
import { MBaseService } from '@service/MBaseService';
import { Request, Response } from 'express';


export class MBaseController {

  // Create a new SBase
  static async createSBase(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const result = await MBaseService.create(data); // Replace 'MBase' with dynamic model name if needed
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(200).json({ success: false, error: error.message });
    }
  }

  // Get a list of SBases
  static async getSBases(req: Request, res: Response): Promise<void> {
    try {
      const result = await MBaseService.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(200).json({ success: false, error: error.message });
    }
  }

  // Get a single SBase by ID
  static async getSBase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MBaseService.getById(id);
      if (result) {
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(200).json({ success: false, error: 'Not found' });
      }
    } catch (error: any) {
      res.status(200).json({ success: false, error: error.message });
    }
  }

  // Update a SBase
  static async updateSBase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await MBaseService.update(id, data);
      if (result) {
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(200).json({ success: false, error: 'Not found' });
      }
    } catch (error: any) {
      res.status(200).json({ success: false, error: error.message });
    }
  }

  // Delete a SBase
  static async deleteSBase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await MBaseService.delete(id);
      if (success) {
        res.status(200).json({ success: true, message: 'Deleted successfully' });
      } else {
        res.status(200).json({ success: false, error: 'Not found' });
      }
    } catch (error: any) {
      res.status(200).json({ success: false, error: error.message });
    }
  }
}
