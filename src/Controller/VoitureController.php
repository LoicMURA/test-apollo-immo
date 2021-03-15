<?php

namespace App\Controller;

use App\Entity\Voiture;
use App\Form\VoitureType;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/voiture")
 */
class VoitureController extends AbstractController
{
    /**
     * @Route("/", name="voiture_index", methods={"GET"})
     */
    public function index(VoitureRepository $voitureRepository): Response
    {
        $form = $this->createForm(VoitureType::class);

        return $this->render('voiture/index.html.twig', [
            'voitures' => $voitureRepository->findBy([], ['name' => 'ASC']),
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/new", name="voiture_new", methods={"POST"})
     */
    public function new(Request $request, EntityManagerInterface $manager): Response
    {
        $voiture = new Voiture();
        $form = $this->createForm(VoitureType::class, $voiture);

        $form->handleRequest($request);
        dump('ok');

        if ($form->isSubmitted() && $form->isValid()) {
            dump('ok');
            $voiture->setCreatedAt(new \DateTime());

            $manager->persist($voiture);
            $manager->flush();

            return $this->json([
                'message' => 'Votre voiture a bien été enregistré',
                'code' => 200,
                'data' => $voiture
            ]);
        }

        return $this->json([
            'message' => 'Une erreur s\'est produite veuillez réessayer plus tard',
            'code' => 500
        ]);
    }

    /**
     * @Route("/{id}", name="voiture_show", methods={"GET"})
     */
    public function show(Voiture $voiture): Response
    {
        return $this->render('voiture/show.html.twig', [
            'voiture' => $voiture,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="voiture_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Voiture $voiture): Response
    {
        $form = $this->createForm(VoitureType::class, $voiture);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('voiture_index');
        }

        return $this->render('voiture/edit.html.twig', [
            'voiture' => $voiture,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="voiture_delete", methods={"DELETE"})
     */
    public function delete(Voiture $voiture, EntityManagerInterface $manager): Response
    {
        $id = $voiture->getId();
        $manager->remove($voiture);
        $manager->flush();

        return $this->json([
            'message' => "La voiture $id a bien été supprimé",
            'code' => 200
        ]);
    }
}
