import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors, // <--- Add this import
  UploadedFile, // <--- Add this import
  BadRequestException, // <--- Add this import
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // This one is already correct
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'; // Node.js File System module

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      // 'resume' is the field name for the file in the form
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './UploadedFiles'; // Root folder for uploads
          // Create the folder if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate a unique filename to prevent overwrites
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Optional: Filter to allow only PDF files
        if (file.mimetype.match(/\/(pdf)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // Optional: Limit file size to 5MB
      },
    }),
  )
  async create(
    @Body() contactData: Partial<Contact>, // Changed from 'contact' to 'contactData' to avoid conflict if 'contact' is also a field in form-data
    @UploadedFile() resumeFile: Express.Multer.File, // The uploaded file object
  ) {
    if (!resumeFile) {
      // Ensure a file was actually uploaded
      throw new BadRequestException('Resume PDF file is required.');
    }

    // You now have the file information in 'resumeFile'
    console.log('✅ Uploaded file details:', resumeFile);
    console.log('File saved at:', resumeFile.path);

    // You can now associate the file path with your contact data
    const contactWithResume = {
      ...contactData,
      resumePath: resumeFile.path, // Store the path in your contact entity/database
      resumeOriginalName: resumeFile.originalname,
      // Add other relevant file metadata if needed
    };

    // Assuming your service can handle the new structure
    const result = await this.contactService.create(contactWithResume);
    console.log('✅ Contact created with resume:', result);
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.contactService.findAll();
    console.log('📄 All contacts fetched:', result.length, 'contacts');
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.contactService.findOne(+id);
    console.log(`📄 Contact fetched with ID ${id}:`, result);
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() contact: Partial<Contact>) {
    const result = await this.contactService.update(+id, contact);
    console.log(`✏️ Contact updated with ID ${id}:`, result);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.contactService.delete(+id);
    console.log(`🗑️ Contact deleted with ID ${id}:`, result);
    return result;
  }
}
